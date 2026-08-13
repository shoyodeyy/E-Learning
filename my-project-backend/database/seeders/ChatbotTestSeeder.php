<?php

namespace Database\Seeders;

use App\Models\Chatbot\ChatMessage;
use App\Models\Chatbot\ChatSession;
use App\Models\Chatbot\Prompt;
use App\Models\Chatbot\PromptVersion;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ChatbotTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Tạo admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        // 2. Tạo prompt + version
        $prompt = Prompt::firstOrCreate(
            ['key' => 'study_helper'],
            [
                'name' => 'Study Helper',
                'description' => 'Assistant giúp trả lời các câu hỏi học tập',
                'created_by' => $admin->id,
            ]
        );

        PromptVersion::firstOrCreate(
            ['prompt_id' => $prompt->id, 'content' => 'Bạn là một trợ lý học tập thân thiện.'],
            ['is_active' => true]
        );

        // 3. Tạo session
        $session = ChatSession::create([
            'user_id' => $admin->id,
            'title'   => 'Test Chat Session',
        ]);

        // 4. Thêm messages
        ChatMessage::create([
            'session_id' => $session->id,
            'role'       => 'user',
            'content'    => 'Xin chào, bạn có thể giúp tôi học toán không?',
            'provider'   => null,
        ]);

        ChatMessage::create([
            'session_id' => $session->id,
            'role'       => 'assistant',
            'content'    => 'Tất nhiên rồi! Bạn muốn ôn phần nào của toán học?',
            'provider'   => 'github',
        ]);
    }
}
