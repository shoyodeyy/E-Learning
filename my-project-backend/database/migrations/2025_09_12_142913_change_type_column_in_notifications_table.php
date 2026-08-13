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
        Schema::table('notifications', function (Blueprint $table) {
            // đổi ENUM sang VARCHAR(50) chẳng hạn
            $table->string('type', 50)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // nếu muốn rollback thì trả về enum cũ
            $table->enum('type', [
                'event_reminder',
                'registration_confirm',
                'event_pending',
                'event_update',
                'event_pending_update'
            ])->change();
        });
    }
};
