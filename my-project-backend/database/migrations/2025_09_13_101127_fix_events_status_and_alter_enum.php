<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // B1: Fix dữ liệu không hợp lệ trước
        DB::table('events')
            ->whereNotIn('status', [
                'pending_create', 'pending_update', 'pending_delete', 'approved', 'completed'
            ])
            ->update(['status' => 'pending_create']);

        // B2: Thay đổi enum
        DB::statement("ALTER TABLE events MODIFY COLUMN status
            ENUM('pending_create', 'pending_update', 'pending_delete', 'approved', 'completed',
                 'rejected_create', 'rejected_update', 'rejected_delete')
            DEFAULT 'pending_create'");
    }

    public function down(): void
    {
        // Rollback enum về cũ
        DB::statement("ALTER TABLE events MODIFY COLUMN status
            ENUM('pending_create', 'pending_update', 'pending_delete', 'approved', 'completed')
            DEFAULT 'pending_create'");
    }
};
