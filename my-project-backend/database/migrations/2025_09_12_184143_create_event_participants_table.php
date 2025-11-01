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
        Schema::create('event_participants', function (Blueprint $table) {
            $table->id('participation_id');
            $table->unsignedBigInteger('event_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('role', ['participant', 'organizer'])->default('participant');
            $table->enum('registration_status', ['registered', 'attended', 'cancelled'])->default('registered');
            $table->dateTime('registered_at')->useCurrent();
            $table->dateTime('attended_at')->nullable();
            $table->text('notes')->nullable()->comment('Additional notes about participation');
            
            // Unique constraint - một user chỉ có thể tham gia một event với một role
            $table->unique(['event_id', 'user_id'], 'unique_user_event_participation');
            
            // Foreign key constraints
            $table->foreign('event_id')->references('event_id')->on('events')->cascadeOnDelete();
            $table->foreign('user_id')->references('user_id')->on('users')->cascadeOnDelete();
            
            // Indexes for performance
            $table->index(['event_id', 'role']);
            $table->index(['user_id', 'registration_status']);
            $table->index('registered_at');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_participants');
    }
};