<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

//        User::factory()->createMany([
//           'name' => 'Test User',
//           'email' => 'test@example.com'
//        ]);

        User::factory()->createMany([
            [
                'name' => 'Admin',
                'email' => 'chunhau.py@gmail.com',
                'role' => 'admin',
                'password' => '$2y$12$0hX2X0KGQEPdJd83ymr7vexj13ZmZ6mpTLHa3L.YGKvA2xtUrOZ0m'
            ],
            [
                'name' => 'Instructor',
                'email' => 'tchunhau2006@gmail.com',
                'role' => 'instructor',
                'password' => '$2y$12$0hX2X0KGQEPdJd83ymr7vexj13ZmZ6mpTLHa3L.YGKvA2xtUrOZ0m'
            ]
        ]);

        $this->call(CourseSeeder::class);
    }
}
