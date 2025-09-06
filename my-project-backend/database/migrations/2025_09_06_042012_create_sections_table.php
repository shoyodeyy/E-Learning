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
        Schema::create('sections', function (Blueprint $table) {
            $table->string('sectionId')->primary();
            $table->string('courseID')->nullable();
            $table->string('sectionTitle');
            $table->integer('sectionIndex');
            $table->integer('totalDuration')->default(0);

            // foreign key
            $table->foreign('courseID')
                  ->references('courseID')
                  ->on('courses')->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
