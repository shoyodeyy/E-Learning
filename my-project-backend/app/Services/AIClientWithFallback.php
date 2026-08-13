<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AIClientWithFallback
{
    protected GithubModelsClient $primary;
    protected OpenAIClient $secondary;
    public function __construct(GithubModelsClient $primary, OpenAIClient $secondary)
    {
        $this->primary   = $primary;
        $this->secondary = $secondary;
    }

    /**
     * @throws Exception
     */
    public function complete(array $messages, array $options = []): string
    {
        $onProvider = $options['onProvider'] ?? null;
        try {
            if (is_callable($onProvider)) { $onProvider('github'); }
            Log::info("AI Request → Provider: GitHub");
            return $this->primary->complete($messages, $options);
        } catch (Exception $e) {
            Log::warning("Primary (GitHub) failed: " . $e->getMessage() . " → fallback OpenAI");
            if (is_callable($onProvider)) { $onProvider('openai'); }
            return $this->secondary->complete($messages, $options);
        }
    }

    /**
     * Stream via primary with fallback to secondary on 429.
     * If callbacks provided (onDelta/onComplete), executes streaming inline (no response returned).
     * Otherwise returns a StreamedResponse passthrough.
     * @throws Exception
     */
    public function stream(array $messages, array $options = []) /*: ?StreamedResponse*/
    {
        $hasCallbacks = isset($options['onDelta']) || isset($options['onComplete']);
        $onProvider = $options['onProvider'] ?? null;
        try {
            if (is_callable($onProvider)) { $onProvider('github'); }
            Log::info("AI Stream → Provider: GitHub" . ($hasCallbacks ? " (callbacks)" : ""));
            return $this->primary->stream($messages, $options);
        } catch (Exception $e) {
            Log::warning("Primary (GitHub) stream failed: " . $e->getMessage() . " → fallback OpenAI" . ($hasCallbacks ? " (callbacks)" : ""));
            if (is_callable($onProvider)) { $onProvider('openai'); }
            return $this->secondary->stream($messages, $options);
        }
    }
}
