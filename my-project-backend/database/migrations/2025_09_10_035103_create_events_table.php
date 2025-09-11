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
        Schema::create('events', function (Blueprint $table) {
            $table->id('event_id');
            $table->string('title');
            $table->text('description');
            $table->enum('category', [
                'Cultural Event',
                'Technical Fests',
                'Sports Meets',
                'Annual Day Functions',
                'Workshops and Seminars',
                'Intercollegiate Competitions'
            ]);
            $table->dateTime('start_at');
            $table->integer('duration_minutes')->comment('Total event time in minutes');
            $table->string('venue');
            $table->unsignedBigInteger('organizerId');
            $table->integer('maxParticipants')->default(100);
            $table->dateTime('registrationDeadline');
            $table->string('bannerImage');
            $table->enum('status', ['pending', 'approved', 'cancelled', 'completed'])->default('pending');

            // foreign key
            $table->foreign('organizerId')
                ->references('user_id')
                ->on('users')
                ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
