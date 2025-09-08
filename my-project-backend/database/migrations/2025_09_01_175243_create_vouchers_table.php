<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('discount_type', ['percent', 'fixed']);
            $table->decimal('discount_value', 8, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('usage_limit')->default(1);
            $table->boolean('status')->default(true);
            $table->decimal('min_order', 12, 2)->default(0);
            $table->date('expired_at')->nullable();
            $table->boolean('active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
