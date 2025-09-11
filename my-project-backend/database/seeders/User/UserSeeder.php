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

        // =========================
        // Tạo 300 organizers (instructors)
        // =========================
        for ($i = 0; $i < 300; $i++) {
            $createdDate = $faker->dateTimeBetween('-10 months', '-6 months');

            User::create([
                'name' => $faker->name,
                'email' => 'organizer' . ($i + 1) . '@example.com',
                'password' => Hash::make('password123'),
                'profile' => 'Organizer system',
                'role' => 'organizer',
                'google_id' => null,
                'email_verified_at' => $createdDate,
                'ban_reason' => null,
                'ban_until' => null,
                'department' => $faker->randomElement(['IT', 'Business', 'Design', 'Engineering']),
                'enrollment_no' => 'ORG' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'created_at' => $createdDate,
                'updated_at' => $createdDate,
            ]);
        }

        // =========================
        // Tạo 1000 participants (students)
        // =========================
        for ($i = 0; $i < 1000; $i++) {
            $createdDate = $faker->dateTimeBetween('-1 year', 'now');

            $hasGoogleId = $faker->boolean(30);
            $googleId = $hasGoogleId ? 'google_' . $faker->uuid : null;

            $isVerified = $hasGoogleId || $faker->boolean(85);
            $emailVerifiedAt = $isVerified ? $createdDate : null;

            $isBanned = $faker->boolean(3);
            $banReason = null;
            $banUntil = null;

            if ($isBanned) {
                $banReasons = [
                    'Violation of community guidelines',
                    'Content spam',
                    'Malicious behavior',
                    'Inappropriate language use',
                    'Creating multiple fake accounts'
                ];
                $banReason = $faker->randomElement($banReasons);
                $banUntil = $faker->dateTimeBetween('now', '+30 days');
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
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => $hasGoogleId ? null : Hash::make('password123'),
                'profile' => $faker->randomElement($profiles),
                'role' => 'participant',
                'google_id' => $googleId,
                'email_verified_at' => $emailVerifiedAt,
                'ban_reason' => $banReason,
                'ban_until' => $banUntil,
                'department' => $faker->randomElement(['IT', 'Business', 'Design', 'Engineering']),
                'enrollment_no' => 'STU' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'created_at' => $createdDate,
                'updated_at' => $createdDate,
            ]);
        }

        // =========================
        // Tạo 12 tháng dữ liệu growth
        // =========================
        for ($m = 0; $m < 12; $m++) {
            $monthStart = now()->subMonths($m + 1)->startOfMonth();
            $monthEnd   = now()->subMonths($m + 1)->endOfMonth();

            $base = 80;
            $variation = rand(-30, 50);
            $newUsersCount = max(10, $base + $variation);

            for ($i = 0; $i < $newUsersCount; $i++) {
                $createdDate = $faker->dateTimeBetween($monthStart, $monthEnd);

                $hasGoogleId = $faker->boolean(25 + ($m * 2));
                $googleId = $hasGoogleId ? 'google_' . $faker->uuid : null;

                $isVerified = $hasGoogleId || $faker->boolean(85);
                $emailVerifiedAt = $isVerified ? $createdDate : null;

                $isBanned = $faker->boolean(3);
                $banReason = null;
                $banUntil = null;

                if ($isBanned) {
                    $banReasons = [
                        'Violation of community guidelines',
                        'Content spam',
                        'Malicious behavior',
                        'Inappropriate language use',
                        'Creating multiple fake accounts'
                    ];
                    $banReason = $faker->randomElement($banReasons);
                    $banUntil = $faker->dateTimeBetween('now', '+30 days');
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
                    'name' => $faker->name,
                    'email' => $faker->unique()->safeEmail,
                    'password' => $hasGoogleId ? null : Hash::make('password123'),
                    'profile' => $faker->randomElement($profiles),
                    'role' => 'participant',
                    'google_id' => $googleId,
                    'email_verified_at' => $emailVerifiedAt,
                    'ban_reason' => $banReason,
                    'ban_until' => $banUntil,
                    'department' => $faker->randomElement(['IT', 'Business', 'Design', 'Engineering']),
                    'enrollment_no' => 'STU' . strtoupper(uniqid()),
                    'created_at' => $createdDate,
                    'updated_at' => $createdDate,
                ]);
            }
        }

        // =========================
        // Tạo thêm 50 user mới gần đây
        // =========================
        for ($i = 0; $i < 50; $i++) {
            $createdDate = $faker->dateTimeBetween('-30 days', 'now');
            $hasGoogleId = $faker->boolean(35);
            $googleId = $hasGoogleId ? 'google_recent_' . $faker->uuid : null;
            $isVerified = $hasGoogleId || $faker->boolean(90);

            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => $hasGoogleId ? null : Hash::make('password123'),
                'profile' => 'new user',
                'role' => 'participant',
                'google_id' => $googleId,
                'email_verified_at' => $isVerified ? $createdDate : null,
                'ban_reason' => null,
                'ban_until' => null,
                'department' => $faker->randomElement(['IT', 'Business', 'Design', 'Engineering']),
                'enrollment_no' => 'STU' . strtoupper(uniqid()),
                'created_at' => $createdDate,
                'updated_at' => $createdDate,
            ]);
        }


        for ($i = 0; $i < 5; $i++) {
            User::create([
                'name' => 'Admin ' . ($i + 1),
                'email' => 'admin' . ($i + 1) . '@example.com',
                'password' => Hash::make('admin123'),
                'profile' => 'System administrator',
                'role' => 'admin',
                'google_id' => null,
                'email_verified_at' => now(),
                'ban_reason' => null,
                'ban_until' => null,
                'department' => 'Management',
                'enrollment_no' => 'ADM' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Users created successfully!');
        $this->command->info('Organizers: 300');
        $this->command->info('Participants: ~1000+');
        $this->command->info('Admins: 5');
        $this->command->info('Total: ' . User::count() . ' users');
    }
}
