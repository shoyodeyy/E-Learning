<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RegistrationsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('registrations')->insert([
            [
                'registration_id' => 1,
                'user_id' => 4, // John Participant
                'event_id' => 1, // event đã tồn tại
                'status' => 'confirmed',
                'attendance_status' => true,
                'qr_code' => null,
            ],
            [
                'registration_id' => 2,
                'user_id' => 4,
                'event_id' => 2,
                'status' => 'confirmed',
                'attendance_status' => true,
                'qr_code' => null,
            ],
            [
                'registration_id' => 3,
                'user_id' => 4,
                'event_id' => 3,
                'status' => 'waitlist',
                'attendance_status' => false,
                'qr_code' => null,
            ],
        ]);
    }
}
