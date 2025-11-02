<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE notifications MODIFY COLUMN type 
            ENUM(
                'event_reminder',
                'registration_confirm',
                'event_update',
                'system_announcement',
                'event_pending',
                'event_approved',
                'event_rejected'
            ) NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE notifications MODIFY COLUMN type 
            ENUM(
                'event_reminder',
                'registration_confirm',
                'event_update',
                'system_announcement'
            ) NOT NULL");
    }
};
