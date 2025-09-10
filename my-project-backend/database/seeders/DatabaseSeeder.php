<?php

namespace Database\Seeders;


use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Seeders\User\UserSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

//        $this->call(ChatbotTestSeeder::class);

        $this->call([
//            UserSeeder::class,
        ]);

//        $this->call(CourseSeeder::class);
        $this->call(EventSeeder::class);
        $this->call(EventsTableSeeder::class);
        $this->call(MediaGalleryTableSeeder::class);
    }
}
