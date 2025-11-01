<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Sửa đổi enum status để thêm các trạng thái rejected
        DB::statement("ALTER TABLE events MODIFY COLUMN status ENUM('pending_create', 'pending_update', 'pending_delete', 'approved', 'completed', 'rejected_create', 'rejected_update', 'rejected_delete') DEFAULT 'pending_create'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback enum status về trạng thái cũ
        DB::statement("ALTER TABLE events MODIFY COLUMN status ENUM('pending_create', 'pending_update', 'pending_delete', 'approved', 'completed') DEFAULT 'pending_create'");
    }
};
