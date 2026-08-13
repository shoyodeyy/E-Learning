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
        Schema::create('registration_seats', function (Blueprint $table) {
            $table->id('seat_id');
            $table->unsignedBigInteger('registration_id');
            $table->string('seat_number', 10);
            $table->timestamps();

            // unique
            $table->unique(['registration_id', 'seat_number']);

            // foreign key
            $table->foreign('registration_id')
                  ->references('registration_id')
                  ->on('registrations')
                  ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registration_seats');
    }
};
