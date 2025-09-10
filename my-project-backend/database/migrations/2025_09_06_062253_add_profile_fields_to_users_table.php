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
        Schema::table('users', function (Blueprint $table) {
            // Thông tin cá nhân
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 15)->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->string('address', 255)->nullable()->after('phone');
            }
            if (!Schema::hasColumn('users', 'gender')) {
                $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('address');
            }
            if (!Schema::hasColumn('users', 'profile')) {
                $table->string('profile', 255)->nullable()->after('password');
            }
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar', 255)->nullable()->after('status');
            }

            // Vai trò & trạng thái
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['participant', 'organizer', 'admin'])
                    ->default('participant')
                    ->after('profile');
            }
            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status', 20)
                    ->default('active')
                    ->comment('active, expired, lifted')
                    ->after('role');
            }

            // Google OAuth
            if (!Schema::hasColumn('users', 'google_id')) {
                $table->string('google_id', 255)->nullable()->unique()->after('avatar');
            }

            // Banned info
            if (!Schema::hasColumn('users', 'ban_until')) {
                $table->timestamp('ban_until')->nullable()->after('google_id');
            }
            if (!Schema::hasColumn('users', 'ban_reason')) {
                $table->string('ban_reason', 255)->nullable()->after('ban_until');
            }
            if (!Schema::hasColumn('users', 'banned_by')) {
                $table->unsignedBigInteger('banned_by')->nullable()->after('ban_reason');
                $table->foreign('banned_by')->references('user_id')->on('users')->nullOnDelete();
            }

            // Academic info
            if (!Schema::hasColumn('users', 'department')) {
                $table->string('department', 100)->nullable()->after('banned_by');
            }
            if (!Schema::hasColumn('users', 'enrollment_no')) {
                $table->string('enrollment_no', 50)->nullable()->after('department');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'enrollment_no')) {
                $table->dropColumn('enrollment_no');
            }
            if (Schema::hasColumn('users', 'department')) {
                $table->dropColumn('department');
            }
            if (Schema::hasColumn('users', 'banned_by')) {
                $table->dropForeign(['banned_by']);
                $table->dropColumn('banned_by');
            }
            if (Schema::hasColumn('users', 'ban_reason')) {
                $table->dropColumn('ban_reason');
            }
            if (Schema::hasColumn('users', 'ban_until')) {
                $table->dropColumn('ban_until');
            }
            if (Schema::hasColumn('users', 'google_id')) {
                $table->dropColumn('google_id');
            }
            if (Schema::hasColumn('users', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
            if (Schema::hasColumn('users', 'avatar')) {
                $table->dropColumn('avatar');
            }
            if (Schema::hasColumn('users', 'profile')) {
                $table->dropColumn('profile');
            }
            if (Schema::hasColumn('users', 'gender')) {
                $table->dropColumn('gender');
            }
            if (Schema::hasColumn('users', 'address')) {
                $table->dropColumn('address');
            }
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }
        });
    }
};
