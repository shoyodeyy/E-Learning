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
        Schema::create('event_approvals', function (Blueprint $table) {
            $table->id('approval_id');
            $table->unsignedBigInteger('event_id');
            $table->unsignedBigInteger('approved_by'); // admin user_id
            $table->enum('action_type', ['approve', 'reject']);
            $table->enum('approval_type', ['create', 'update', 'delete']); // loại kiểm duyệt
            $table->text('notes')->nullable(); // ghi chú, lý do từ chối
            $table->json('previous_data')->nullable(); // dữ liệu cũ (cho update)
            $table->json('new_data')->nullable(); // dữ liệu mới (cho update)
            $table->timestamp('approved_at');
            $table->timestamps();

            // Foreign keys
            $table->foreign('event_id')
                ->references('event_id')
                ->on('events')
                ->onDelete('cascade');
                
            $table->foreign('approved_by')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');

            // Indexes
            $table->index(['event_id', 'approval_type']);
            $table->index('approved_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_approvals');
    }
};
