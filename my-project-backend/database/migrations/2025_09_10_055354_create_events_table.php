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
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->enum('category', ['cultural', 'technical', 'sports', 'annual_day', 'workshop_seminar', 'intercollegiate']);
            $table->date('event_date');
            $table->time('event_time');
            $table->string('venue', 100);
            $table->unsignedBigInteger('organizer_id');
            $table->integer('max_participants')->default(100);
            $table->dateTime('registration_deadline')->nullable();
            $table->string('banner_image', 255)->nullable();
            $table->enum('status', ['pending', 'approved', 'cancelled', 'completed'])->default('pending');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('organizer_id')->references('user_id')->on('users')->cascadeOnDelete();
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
