<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\Event\EventsTableSeeder;
use Database\Seeders\MediaGallery\MediaGalleryTableSeeder;
use Database\Seeders\User\UsersTableSeeder;
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
        $this->call([
            UsersTableSeeder::class,
            EventsTableSeeder::class,
            MediaGalleryTableSeeder::class,
        ]);

    }
}
