<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /**
         * Chat sessions
         */
        Schema::create('chat_sessions', function (Blueprint $table) {
            $table->id('session_id');
            $table->foreignId('user_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->timestamps();
        });

        /**
         * Chat messages
         */
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id('message_id');
            $table->foreignId('session_id')
                ->constrained('chat_sessions', 'session_id')
                ->cascadeOnDelete();
            $table->enum('role', ['user', 'assistant', 'system']);
            $table->longText('content');
            $table->enum('provider', ['openai', 'github', 'system'])->nullable();
            $table->timestamps();
        });

        /**
         * Prompts
         */
        Schema::create('prompts', function (Blueprint $table) {
            $table->id('prompt_id');
            $table->string('key')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('created_by')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->timestamps();
        });

        /**
         * Prompt versions
         */
        Schema::create('prompt_versions', function (Blueprint $table) {
            $table->id('version_id');
            $table->foreignId('prompt_id')
                ->constrained('prompts', 'prompt_id')
                ->cascadeOnDelete();
            $table->longText('content');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prompt_versions');
        Schema::dropIfExists('prompts');
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chat_sessions');
    }
};
