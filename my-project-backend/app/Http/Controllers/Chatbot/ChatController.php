<?php

namespace App\Http\Controllers\Chatbot;

use App\Http\Controllers\Controller;
use App\Models\Chatbot\ChatSession;
use App\Models\Chatbot\ChatMessage;
use App\Models\Chatbot\Prompt;
use App\Services\AIClientWithFallback;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatController extends Controller
{
    public function stream(Request $request, AIClientWithFallback $ai): StreamedResponse
    {
        $request->validate([
            'message' => 'required|string',
            'session_id' => 'nullable|integer|exists:chat_sessions,id',
        ]);

        // 🟣 Lấy user từ token (nếu có)
        $user = $request->user();
        $sessionId = $request->input('session_id');
        $message   = $request->input('message');

        // 🟣 Xác định session
        if ($sessionId) {
            // Chỉ cho phép truy cập session thuộc về user hiện tại
            if (!$user) {
                abort(403, 'Unauthorized session access');
            }
            $session = ChatSession::where('id', $sessionId)
                ->where('user_id', $user->id)
                ->firstOrFail();
        } else {
            $session = ChatSession::create([
                'user_id' => $user?->id,
                'title'   => 'Chat session ' . now()->format('d/m/Y H:i'),
            ]);
        }

        // 🟣 Lưu message user
        ChatMessage::create([
            'session_id' => $session->id,
            'role'       => 'user',
            'content'    => $message,
            'provider'   => null,
        ]);

        // 🟣 Chuẩn bị messages cho AI từ lịch sử hội thoại của session (ghi nhớ ngữ cảnh)
        $prompt = Prompt::with('versions')->first();
        $activeVersion = $prompt?->activeVersion();

        // Lấy lịch sử gần nhất (giới hạn để tránh quá token)
        $limit = (int) env('CHATBOT_HISTORY_LIMIT', 24);
        $history = \App\Models\Chatbot\ChatMessage::where('session_id', $session->id)
            ->orderBy('id', 'desc')
            ->limit($limit)
            ->get(['role', 'content'])
            ->reverse(); // về thứ tự tăng dần

        $messages = [];
        if ($activeVersion) {
            $messages[] = ['role' => 'system', 'content' => $activeVersion->content];
        }
        foreach ($history as $m) {
            $messages[] = ['role' => $m->role, 'content' => $m->content];
        }

        // 🟣 Trả về StreamedResponse
        return new StreamedResponse(function () use ($ai, $messages, $session) {
            try {
                @ini_set('zlib.output_compression', '0');
                @ini_set('output_buffering', 'off');
                while (ob_get_level() > 0) { @ob_end_flush(); }
                @ob_implicit_flush(true);
                // Gửi sessionId đầu tiên cho FE
                echo "data: __SESSION:{$session->id}\n\n";
                flush();

                $buffer = '';
                $saved = false;
                $usedProvider = null;
                // Stream qua callbacks: forward delta + lưu khi xong
                $ai->stream($messages, [
                    'onProvider' => function (string $provider) use (&$usedProvider) {
                        $usedProvider = $provider;
                        echo "data: __PROVIDER:" . $provider . "\n\n";
                        flush();
                    },
                    'onDelta' => function ($delta) use (&$buffer) {
                        if ($delta !== '') {
                            $buffer .= $delta;
                            // Chuẩn SSE: nếu có xuống dòng, phát nhiều dòng data
                            $lines = preg_split("/(\r\n|\r|\n)/", $delta);
                            foreach ($lines as $i => $line) {
                                echo "data: " . $line . "\n";
                            }
                            echo "\n"; // kết thúc event
                            flush();
                        }
                    },
                    'onComplete' => function () use (&$buffer, $session, &$saved, &$usedProvider) {
                        // Lưu message assistant vào DB khi xong
                        if (!empty($buffer)) {
                            ChatMessage::create([
                                'session_id' => $session->id,
                                'role'       => 'assistant',
                                'content'    => $buffer,
                                'provider'   => $usedProvider ?: 'github',
                            ]);
                            $saved = true;
                        }
                        // Gửi tín hiệu DONE cho FE
                        echo "data: [DONE]\n\n";
                        flush();
                    },
                ]);
                // Nếu vì lý do nào đó callback không được gọi, vẫn cố lưu buffer
                if (!$saved && !empty($buffer)) {
                    ChatMessage::create([
                        'session_id' => $session->id,
                        'role'       => 'assistant',
                        'content'    => $buffer,
                        'provider'   => $usedProvider ?: 'github',
                    ]);
                    echo "data: [DONE]\n\n";
                    flush();
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

    public function history(Request $request, $sessionId)
    {
        $user = $request->user();
        $session = ChatSession::with(['messages' => function ($q) {
                $q->orderBy('id');
            }])
            ->where('id', $sessionId)
            ->where('user_id', $user->id)
            ->firstOrFail();
        return response()->json($session);
    }

    public function sessions(Request $request)
    {
        $user = $request->user();
        $sessions = ChatSession::where('user_id', $user->id)
            ->latest()
            ->get(['id', 'title', 'created_at']);

        return response()->json($sessions);
    }
}
