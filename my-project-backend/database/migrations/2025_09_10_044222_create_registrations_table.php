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
        Schema::create('registrations', function (Blueprint $table) {
            $table->id('registration_id');
            $table->string('event_id');
            $table->unsignedBigInteger('user_id');
            $table->dateTime('registered_on')->useCurrent();
            $table->enum('status', ['confirmed', 'cancelled', 'waitlist'])->default('confirmed');
            $table->boolean('attendance_status')->default(false);
            $table->string('qr_code', 255)->nullable();

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
        Schema::dropIfExists('registrations');
    }
};
