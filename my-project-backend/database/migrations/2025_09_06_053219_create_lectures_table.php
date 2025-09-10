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
        Schema::create('lectures', function (Blueprint $table) {
            $table->string('lectureId')->primary();
            $table->string('sectionId');
            $table->string('type')->default('Lecture');
            $table->string('lectureTitle');
            $table->integer('lectureIndex');
            $table->string('videoUrl')->nullable();
            $table->string('videoFile')->nullable();
            $table->string('thumbnail')->nullable();
            $table->integer('lectureDuration')->nullable();

            // foreign key
            $table->foreign('sectionId')
                  ->references('sectionId')
                  ->on('sections')
                  ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lectures');
    }
};
