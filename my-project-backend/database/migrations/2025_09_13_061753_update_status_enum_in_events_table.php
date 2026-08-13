<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE events MODIFY status
            ENUM('pending_create', 'pending_update', 'pending_delete', 'approved', 'rejected')
            DEFAULT 'pending_create'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE events MODIFY status
            ENUM('pending_create', 'pending_update', 'pending_delete', 'approved')
            DEFAULT 'pending_create'");
    }
};
