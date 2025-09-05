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
        // categories table
        Schema::create('categories', function (Blueprint $table) {
            $table->string('categoryID')->primary();
            $table->string('categoryName');
            $table->text('categoryDescription')->nullable();
        });

        // statuses table
        Schema::create('statuses', function (Blueprint $table) {
            $table->string("statusID")->primary();
            $table->string("statusName");
        });

        // courses table
        Schema::create('courses', function (Blueprint $table) {
            $table->string('courseID')->primary();

            $table->string('categoryID');
            $table->string('statusID')->nullable();

            $table->string('courseTitle');
            $table->text('courseDescription')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('level')->nullable(); // Beginner, Intermediate, Advanced...
            $table->decimal('avgRating', 3, 2)->default(0);
            $table->integer('totalStudents')->default(0);

            $table->enum('badge', ['none', 'bestseller', 'featured', 'new', 'hot', 'sale'])->default('none');

            $table->unsignedBigInteger('instructorID')->nullable();
            $table->unsignedBigInteger('approvedBy')->nullable();

            // foreign key
            // categoryID
            $table->foreign('categoryID')
                  ->references('categoryID')
                  ->on('categories')
                  ->cascadeOnDelete();

            // statusID
            $table->foreign('statusID')
                  ->references('statusID')
                  ->on('statuses')
                  ->nullOnDelete();

            // instructorID
            $table->foreign('instructorID')
                  ->references('id')
                  ->on('users')
                  ->cascadeOnDelete();

            // approvedBy
            $table->foreign('approvedBy')
                  ->references('id')
                  ->on('users')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
        Schema::dropIfExists('statuses');
        Schema::dropIfExists('categories');
    }
};
