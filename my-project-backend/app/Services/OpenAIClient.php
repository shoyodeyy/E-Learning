<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OpenAIClient
{
    protected string $token;
    protected string $model;
    protected string $url;

    public function __construct()
    {
        $this->token = env('OPENAI_API_KEY');
        $this->model = env('OPENAI_MODEL', 'gpt-4o-mini');
        $this->url   = env('OPENAI_API_URL', 'https://api.openai.com/v1/chat/completions');
    }

    public function complete(array $messages, array $options = []): string
    {
        // Remove non-API options
        $apiOptions = array_diff_key($options, [
            'onDelta' => true,
            'onComplete' => true,
            'onProvider' => true,
        ]);

        $payload = array_merge([
            'model' => $this->model,
            'messages' => $messages,
            'temperature' => 0.3,
            'max_tokens' => 512,
        ], $apiOptions);

        $response = Http::withToken($this->token)
            ->acceptJson()
            ->post($this->url, $payload);

        if ($response->failed()) {
            throw new \Exception("OpenAI API error: {$response->status()} " . $response->body());
        }

        $data = $response->json();
        return $data['choices'][0]['message']['content'] ?? '';
    }

    public function stream(array $messages, array $options = []): ?StreamedResponse
    {
        $onDelta    = $options['onDelta']    ?? null;
        $onComplete = $options['onComplete'] ?? null;
        $useCallbacks = is_callable($onDelta) || is_callable($onComplete);

        // Remove non-API options
        $apiOptions = array_diff_key($options, [
            'onDelta' => true,
            'onComplete' => true,
            'onProvider' => true,
        ]);

        $payload = array_merge([
            'model'    => $this->model,
            'messages' => $messages,
            'stream'   => true,
        ], $apiOptions);

        if ($useCallbacks) {
            try {
                $response = Http::withToken($this->token)
                    ->withHeaders(['Accept' => 'text/event-stream'])
                    ->withOptions(['stream' => true, 'timeout' => 300])
                    ->post($this->url, $payload);

                if ($response->failed()) {
                    throw new \Exception("OpenAI API error: {$response->status()} " . $response->body());
                }

                $body   = $response->toPsrResponse()->getBody();
                $buffer = '';

                while (!$body->eof() && !connection_aborted()) {
                    $buffer .= $body->read(8192);

                    while (($pos = strpos($buffer, "\n\n")) !== false) {
                        $event  = substr($buffer, 0, $pos);
                        $buffer = substr($buffer, $pos + 2);

                        $event = str_replace("\r", '', $event);
                        $payloadLines = [];
                        foreach (explode("\n", $event) as $line) {
                            if (stripos($line, 'data:') === 0) {
                                $payloadLines[] = ltrim(substr($line, 5));
                            }
                        }
                        $payloadStr = trim(implode("\n", $payloadLines));
                        if ($payloadStr === '') { continue; }

                        if ($payloadStr === '[DONE]') {
                            if (is_callable($onComplete)) { $onComplete(); }
                            return null;
                        }

                        $json = json_decode($payloadStr, true);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            continue;
                        }

                        $delta = $json['choices'][0]['delta']['content'] ?? '';
                        if ($delta === '' && isset($json['choices'][0]['text'])) {
                            $delta = $json['choices'][0]['text'];
                        }

                        if ($delta !== '' && is_callable($onDelta)) {
                            $onDelta($delta);
                        }

                        $finish = $json['choices'][0]['finish_reason'] ?? null;
                        if ($finish === 'stop' || $finish === 'length') {
                            if (is_callable($onComplete)) { $onComplete(); }
                            return null;
                        }
                    }
                }

                if (is_callable($onComplete)) { $onComplete(); }
                return null;
            } catch (\Throwable $e) {
                throw $e instanceof \Exception ? $e : new \Exception($e->getMessage(), 0, $e);
            }
        }

        return new StreamedResponse(function () use ($payload) {
            try {
                @ini_set('zlib.output_compression', '0');
                @ini_set('output_buffering', 'off');
                while (ob_get_level() > 0) { @ob_end_flush(); }
                @ob_implicit_flush(true);

                $response = Http::withToken($this->token)
                    ->withHeaders(['Accept' => 'text/event-stream'])
                    ->withOptions(['stream' => true, 'timeout' => 300])
                    ->post($this->url, $payload);

                if ($response->failed()) {
                    echo "data: [ERROR] " . $response->status() . " " . $response->body() . "\n\n";
                    echo "data: [DONE]\n\n";
                    flush();
                    return;
                }

                $body   = $response->toPsrResponse()->getBody();
                $buffer = '';

                while (!$body->eof() && !connection_aborted()) {
                    $buffer .= $body->read(8192);

                    while (($pos = strpos($buffer, "\n\n")) !== false) {
                        $event  = substr($buffer, 0, $pos);
                        $buffer = substr($buffer, $pos + 2);

                        $event = str_replace("\r", '', $event);
                        $payloadLines = [];
                        foreach (explode("\n", $event) as $line) {
                            if (stripos($line, 'data:') === 0) {
                                $payloadLines[] = ltrim(substr($line, 5));
                            }
                        }
                        $payloadStr = trim(implode("\n", $payloadLines));
                        if ($payloadStr === '') { continue; }

                        if ($payloadStr === '[DONE]') {
                            echo "data: [DONE]\n\n"; flush(); return;
                        }

                        $json = json_decode($payloadStr, true);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            continue;
                        }

                        $delta = $json['choices'][0]['delta']['content'] ?? '';
                        if ($delta === '' && isset($json['choices'][0]['text'])) {
                            $delta = $json['choices'][0]['text'];
                        }

                        if ($delta !== '') {
                            $lines = preg_split("/(\r\n|\r|\n)/", $delta);
                            foreach ($lines as $line) {
                                echo "data: " . $line . "\n";
                            }
                            echo "\n";
                            flush();
                        }

                        $finish = $json['choices'][0]['finish_reason'] ?? null;
                        if ($finish === 'stop' || $finish === 'length') {
                            echo "data: [DONE]\n\n"; flush(); return;
                        }
                    }
                }
            } catch (\Throwable $e) {
                echo "data: [ERROR] " . $e->getMessage() . "\n\n";
                echo "data: [DONE]\n\n";
                flush();
            }
        }, 200, [
            'Content-Type'      => 'text/event-stream',
            'Cache-Control'     => 'no-cache, no-transform',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
