<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            // Event 1 - Dữ liệu cũ
            [
                'title'                => 'Cultural Festival',
                'description'          => 'A celebration of cultural diversity with music, dance, and art performances.',
                'category'             => 'Cultural Event',
                'start_at'             => '2025-10-01 18:00',
                'duration_minutes'     => 90,
                'venue'                => 'Main Auditorium',
                'organizerId'          => 2,
                'approvedBy'           => 1,
                'maxParticipants'      => 300,
                'registrationDeadline' => '2025-09-25 23:59:59',
                'bannerImage'          => 'http://localhost:8000/storage/events/banners/1.jpg',
                'status'               => 'approved',
            ],

            // Event 2 - Dữ liệu cũ
            [
                'title'                => 'Technical Workshop',
                'description'          => 'Hands-on workshop on AI and Machine Learning for beginners.',
                'category'             => 'Workshops and Seminars',
                'start_at'             => '2025-09-12 15:00',
                'duration_minutes'     => 120,
                'venue'                => 'Computer Lab 2',
                'organizerId'          => 2,
                'approvedBy'           => null,
                'maxParticipants'      => 100,
                'registrationDeadline' => '2025-11-10 23:59:59',
                'bannerImage'          => 'http://localhost:8000/storage/events/banners/2.jpg',
                'status'               => 'pending_create',
            ],

            // Event 3 - Thêm mới
            [
                'title'                => 'Gourmet Food Fair',
                'description'          => 'A festival for food lovers, featuring local and international cuisines.',
                'category'             => 'Cultural Event',
                'start_at'             => '2025-09-13 11:00',
                'duration_minutes'     => 420,
                'venue'                => 'City Market Hall',
                'organizerId'          => 2,
                'approvedBy'           => 1,
                'maxParticipants'      => 500,
                'registrationDeadline' => '2025-11-15 23:59:59',
                'bannerImage'          => 'http://localhost:8000/storage/events/banners/3.jpg',
                'status'               => 'approved',
            ],

            // Event 4 - Thêm mới
            [
                'title'                => 'Annual Charity Run',
                'description'          => 'Join us for a 5k run to support local charities.',
                'category'             => 'Sports Meets',
                'start_at'             => '2025-09-14 07:00',
                'duration_minutes'     => 300,
                'venue'                => 'Riverside Park',
                'organizerId'          => 2,
                'approvedBy'           => 1,
                'maxParticipants'      => 1000,
                'registrationDeadline' => '2025-11-30 23:59:59',
                'bannerImage'          => 'http://localhost:8000/storage/events/banners/4.jpg',
                'status'               => 'approved',
            ],

            // Event 5 - Thêm mới
            [
                'title'                => 'Future Innovators Hackathon',
                'description'          => 'A 2-day hackathon focused on solving challenges with technology.',
                'category'             => 'Technical Fests',
                'start_at'             => '2025-09-15 09:00',
                'duration_minutes'     => 1440,
                'venue'                => 'Tech Hub Auditorium',
                'organizerId'          => 2,
                'approvedBy'           => null,
                'maxParticipants'      => 50,
                'registrationDeadline' => '2026-01-05 23:59:59',
                'bannerImage'          => 'http://localhost:8000/storage/events/banners/5.jpg',
                'status'               => 'pending_update',
            ],

            // Event 6 - Thêm mới
            [
                'title'                => 'Student Art Exhibition',
                'description'          => 'Showcasing the best artworks from students across campus.',
                'category'             => 'Annual Day Functions',
                'start_at'             => '2025-09-16 10:00',
                'duration_minutes'     => 360,
                'venue'                => 'Art Gallery',
                'organizerId'          => 2,
                'approvedBy'           => null,
                'maxParticipants'      => 200,
                'registrationDeadline' => '2026-02-10 23:59:59',
                'bannerImage'          => 'http://localhost:8000/storage/events/banners/6.jpg',
                'status'               => 'pending_delete',
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
