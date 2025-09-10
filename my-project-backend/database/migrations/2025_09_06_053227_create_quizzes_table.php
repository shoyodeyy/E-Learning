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
        Schema::create('quizzes', function (Blueprint $table) {
            $table->string('quizId')->primary();
            $table->string('sectionId');
            $table->string('type')->default('Quiz');
            $table->string('quizTitle');
            $table->integer('quizIndex');
            $table->string('quizDescription')->nullable();

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
        Schema::dropIfExists('quizzes');
    }
};
