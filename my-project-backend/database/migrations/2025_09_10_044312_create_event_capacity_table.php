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
        Schema::create('event_capacity', function (Blueprint $table) {
            $table->id('capacity_id');
            $table->unsignedBigInteger('event_id');
            $table->integer('total_seats');
            $table->integer('registered_count')->default(0);
            $table->boolean('waitlist_enabled')->default(true);
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('event_id')->references('event_id')->on('events')->cascadeOnDelete();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_capacity');
    }
};
