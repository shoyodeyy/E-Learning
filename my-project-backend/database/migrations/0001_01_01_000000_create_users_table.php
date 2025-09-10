<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('name', 100);
            $table->string('email', 100)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('phone', 15)->nullable();
            $table->string('address', 255)->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('password', 255)->nullable(); // nullable cho Google login
            $table->string('profile', 255)->nullable();
            $table->enum('role', ['participant', 'organizer', 'admin'])->default('participant');
            $table->enum('status', ['active', 'banned'])->default('active');
            $table->string('avatar', 255)->nullable();
            $table->string('google_id', 255)->nullable()->unique();
            $table->timestamp('ban_until')->nullable();
            $table->string('ban_reason', 255)->nullable();
            $table->unsignedBigInteger('banned_by')->nullable(); // ref users.user_id
            $table->string('department', 100)->nullable();
            $table->string('enrollment_no', 50)->nullable();
            $table->rememberToken();
            $table->timestamps();

            // Foreign key
            $table->foreign('banned_by')
                ->references('user_id')->on('users')
                ->nullOnDelete();
        });

        Schema::create('password_reset_tokens', static function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', static function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
