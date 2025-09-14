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
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn('department');


            $table->enum('department', [
                'Computer Science',
                'Electrical Engineering',
                'Mechanical Engineering',
                'Business Administration',
                'Marketing',
                'Finance and Accounting',
                'Human Resources',
                'Event Management Office',
                'Library and Information Center',
            ])->nullable()->after('banned_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Xoá enum department
            $table->dropColumn('department');

            // Tạo lại department dạng VARCHAR như cũ
            $table->string('department', 100)->nullable()->after('banned_by');
        });
    }
};
