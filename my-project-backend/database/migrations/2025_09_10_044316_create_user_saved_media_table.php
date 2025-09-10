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
        Schema::create('user_saved_media', function (Blueprint $table) {
            $table->id('saved_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('media_id');
            $table->dateTime('saved_at')->useCurrent();

            $table->unique(['user_id', 'media_id']);
            $table->foreign('user_id')->references('user_id')->on('users')->cascadeOnDelete();
            $table->foreign('media_id')->references('media_id')->on('media_gallery')->cascadeOnDelete();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_saved_media');
    }
};
