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
        Schema::create('media_gallery', function (Blueprint $table) {
            $table->id('media_id');
            $table->unsignedBigInteger('event_id');
            $table->enum('file_type', ['images', 'video']);
            $table->string('file_url', 255);
            $table->string('file_name', 255)->nullable();
            $table->string('caption', 150)->nullable();
            $table->string('department', 100)->nullable();
            $table->integer('event_year');
            $table->boolean('is_featured')->default(false);
            $table->integer('file_size')->nullable();
            $table->unsignedBigInteger('uploaded_by');
            $table->dateTime('uploaded_on')->useCurrent();

            $table->index(['event_id', 'file_type']);
            $table->foreign('event_id')->references('event_id')->on('events')->cascadeOnDelete();
            $table->foreign('uploaded_by')->references('user_id')->on('users')->cascadeOnDelete();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_gallery');
    }
};
