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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id('feedback_id');
            $table->unsignedBigInteger('event_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('role', ['participant', 'organizer'])->default('participant');
            $table->decimal('rating', 2, 1)
                  ->comment('Rating from 1.0 to 5.0')
                  ->check('rating >= 1 AND rating <= 5');
            $table->text('comments')->nullable();
            $table->dateTime('submitted_on')->useCurrent();

            $table->unique(['event_id', 'user_id']);
            $table->foreign('event_id')->references('event_id')->on('events')->cascadeOnDelete();
            $table->foreign('user_id')->references('user_id')->on('users')->cascadeOnDelete();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
