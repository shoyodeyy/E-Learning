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
            [
                'title'                => 'Cultural Festival',
                'description'          => 'A celebration of cultural diversity with music, dance, and art performances.',
                'category'             => 'Cultural Event',
                'start_at'             => '2025-10-01 18:00',
                'duration_minutes'     => '90',
                'venue'                => 'Main Auditorium',
                'organizerId'          => 3,
                'approvedBy'           => 2,
                'maxParticipants'      => 300,
                'registrationDeadline' => '2025-09-25 23:59:59',
                'bannerImage'          => 'cultural_festival.jpg',
                'status'               => 'approved',
            ],
            [
                'title'                => 'Technical Workshop',
                'description'          => 'Hands-on workshop on AI and Machine Learning for beginners.',
                'category'             => 'Workshops and Seminars',
                'start_at'             => '2025-10-02 15:00',
                'duration_minutes'     => '120',
                'venue'                => 'Computer Lab 2',
                'organizerId'          => 3,
                'approvedBy'           => 2,
                'maxParticipants'      => 100,
                'registrationDeadline' => '2025-11-10 23:59:59',
                'bannerImage'          => 'technical_workshop.jpg',
                'status'               => 'pending',
            ],
        ];

        foreach ($events as $index => $event) {
            $eventId = 'E' . str_pad($index + 1, 3, '0', STR_PAD_LEFT);
            $event['event_id'] = $eventId;

            Event::updateOrCreate(
                ['event_id' => $event['event_id']],
                $event
            );
        }
    }
}
