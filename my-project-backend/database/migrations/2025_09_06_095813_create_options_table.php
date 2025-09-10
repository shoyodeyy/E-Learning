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
        Schema::create('quiz_options', function (Blueprint $table) {
            $table->bigIncrements('optionId');
            $table->string('questionId');
            $table->text('optionText');
            $table->string('explainText')->nullable();
            $table->boolean('isCorrect')->default(false);

            // foreign key
            $table->foreign('questionId')
                ->references('questionId')
                ->on('quiz_questions')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('options');
    }
};
