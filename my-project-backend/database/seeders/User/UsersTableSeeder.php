<?php

namespace Database\Seeders\User;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'user_id' => 2,
                'name' => 'Super Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'), // bcrypt
                'role' => 'admin',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3,
                'name' => 'Event Organizer',
                'email' => 'organizer@example.com',
                'password' => Hash::make('password'),
                'role' => 'organizer',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 4,
                'name' => 'John Participant',
                'email' => 'participant@example.com',
                'password' => Hash::make('password'),
                'role' => 'participant',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
