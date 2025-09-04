<?php

namespace Database\Seeders\User;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('vi_VN');

        for ($i = 0; $i < 300; $i++) {
            $createdDate = $faker->dateTimeBetween('-10 months', '-6 months');

            User::create([
                'name' => $faker->name,
                'email' => 'instructor' . ($i + 1) . '@example.com',
                'password' => Hash::make('password123'),
                'profile' => 'Instructor system',
                'role' => 'instructor',
                'google_id' => null,
                'email_verified_at' => $createdDate,
                'ban_reason' => null,
                'banned_until' => null,
                'created_at' => $createdDate,
                'updated_at' => $createdDate,
            ]);
        }

        for ($i = 0; $i < 1000; $i++) {
            $createdDate = $faker->dateTimeBetween('-1 year', 'now');

            $hasGoogleId = $faker->boolean(30);
            $googleId = $hasGoogleId ? 'google_' . $faker->uuid : null;

            $isVerified = $hasGoogleId || $faker->boolean(85);
            $emailVerifiedAt = $isVerified ? $createdDate : null;

            $isBanned = $faker->boolean(3);
            $banReason = null;
            $bannedUntil = null;

            if ($isBanned) {
                $banReasons = [
                    'Violation of community guidelines',
                    'Content spam',
                    'Malicious behavior',
                    'Inappropriate language use',
                    'creating multiple fake accounts'
                ];
                $banReason = $faker->randomElement($banReasons);
                $bannedUntil = $faker->dateTimeBetween('now', '+30 days');
            }

            // Tạo profile ngẫu nhiên
            $profiles = [
                'Users love technology',
                'Enjoy reading and traveling',
                'Developer',
                'University students',
                'Freelancer',
                'Office workers',
                'Teachers',
                'Students',
            ];

            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => $hasGoogleId ? null : Hash::make('password123'),
                'profile' => $faker->randomElement($profiles),
                'role' => 'student',
                'google_id' => $googleId,
                'email_verified_at' => $emailVerifiedAt,
                'ban_reason' => $banReason,
                'banned_until' => $bannedUntil,
                'created_at' => $createdDate,
                'updated_at' => $createdDate,
            ]);
        }

        for ($m = 0; $m < 12; $m++) {
            // Cách đây $m tháng
            $monthStart = now()->subMonths($m + 1)->startOfMonth();
            $monthEnd   = now()->subMonths($m + 1)->endOfMonth();

            // Số lượng user mới trong tháng này: trung bình 80 ± dao động
            $base = 80;
            $variation = rand(-30, 50); // lên xuống tự nhiên
            $newUsersCount = max(10, $base + $variation);

            for ($i = 0; $i < $newUsersCount; $i++) {
                $createdDate = fake()->dateTimeBetween($monthStart, $monthEnd);

                $hasGoogleId = fake()->boolean(25 + ($m * 2)); // gần đây tỷ lệ Google login cao hơn
                $googleId = $hasGoogleId ? 'google_' . fake()->uuid : null;

                $isVerified = $hasGoogleId || fake()->boolean(85);
                $emailVerifiedAt = $isVerified ? $createdDate : null;

                $isBanned = fake()->boolean(3);
                $banReason = null;
                $bannedUntil = null;

                if ($isBanned) {
                    $banReasons = [
                        'Violation of community guidelines',
                        'Content spam',
                        'Malicious behavior',
                        'Inappropriate language use',
                        'Creating multiple fake accounts'
                    ];
                    $banReason = fake()->randomElement($banReasons);
                    $bannedUntil = fake()->dateTimeBetween('now', '+30 days');
                }

                $profiles = [
                    'Love technology',
                    'Enjoy reading and traveling',
                    'Developer',
                    'University student',
                    'Freelancer',
                    'Office worker',
                    'Teacher',
                    'Student',
                ];

                User::create([
                    'name' => fake()->name,
                    'email' => fake()->unique()->safeEmail,
                    'password' => $hasGoogleId ? null : Hash::make('password123'),
                    'profile' => fake()->randomElement($profiles),
                    'role' => 'student',
                    'google_id' => $googleId,
                    'email_verified_at' => $emailVerifiedAt,
                    'ban_reason' => $banReason,
                    'banned_until' => $bannedUntil,
                    'created_at' => $createdDate,
                    'updated_at' => $createdDate,
                ]);
            }
        }

        for ($i = 0; $i < 50; $i++) {
            $createdDate = $faker->dateTimeBetween('-30 days', 'now');
            $hasGoogleId = $faker->boolean(35); // Xu hướng tăng Google login
            $googleId = $hasGoogleId ? 'google_recent_' . $faker->uuid : null;
            $isVerified = $hasGoogleId || $faker->boolean(90); // Tỷ lệ verify cao hơn

            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => $hasGoogleId ? null : Hash::make('password123'),
                'profile' => 'new user',
                'role' => 'student',
                'google_id' => $googleId,
                'email_verified_at' => $isVerified ? $createdDate : null,
                'ban_reason' => null,
                'banned_until' => null,
                'created_at' => $createdDate,
                'updated_at' => $createdDate,
            ]);
        }

        $this->command->info('Created successfully:');
        $this->command->info('- 3 Instructors');
        $this->command->info('- 950 Users normals');
        $this->command->info('Total: ' . User::count() . ' users');
    }
}
