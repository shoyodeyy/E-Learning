<?php

namespace Database\Seeders;

use App\Models\Course\Lecture;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LectureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lectures = [
            [
                'lectureId'      => 'L001',
                'sectionId'      => 'S001',
                'lectureTitle'   => 'Introduction to Development',
                'type'           => 'Lecture',
                'lectureIndex'   => 1,
                'videoUrl'       => 'https://www.youtube.com/watch?v=oG-qhDUyoqY',
                'videoFile'      => null,
                'videoName' => 'Development Intro',
                'thumbnail'      => 'https://i.ytimg.com/vi/oG-qhDUyoqY/hqdefault.jpg',
                'lectureDuration'=> 3273,
            ],
            [
                'lectureId'      => 'L002',
                'sectionId'      => 'S002',
                'lectureTitle'   => 'Business Basics',
                'type'           => 'Lecture',
                'lectureIndex'   => 1,
                'videoUrl'       => 'https://www.youtube.com/watch?v=ci39OSFps4A',
                'videoFile'      => null,
                'videoName' => 'Business Intro',
                'thumbnail'      => 'https://i.ytimg.com/vi/ci39OSFps4A/hqdefault.jpg',
                'lectureDuration'=> 39607,
            ],
            [
                'lectureId'      => 'L003',
                'sectionId'      => 'S003',
                'lectureTitle'   => 'Introduction to IT Fundamentals',
                'type'           => 'Lecture',
                'lectureIndex'   => 1,
                'videoUrl'       => 'https://www.youtube.com/watch?v=Iyfntbj2jWU',
                'videoFile'      => null,
                'videoName' => 'Ultimate IT Fundamentals Course - From Zero to Engineer [22 Hours Released]',
                'thumbnail'      => 'https://i.ytimg.com/vi/Iyfntbj2jWU/hqdefault.jpg',
                'lectureDuration'=> 1283,
            ],
            [
                'lectureId'      => 'L004',
                'sectionId'      => 'S003',
                'lectureTitle'   => 'Overview of Software Systems',
                'type'           => 'Lecture',
                'lectureIndex'   => 1,
                'videoUrl'       => 'https://www.youtube.com/watch?v=m8Icp_Cid5o',
                'videoFile'      => null,
                'videoName' => 'System Design for Beginners Course',
                'thumbnail'      => 'https://i.ytimg.com/vi/m8Icp_Cid5o/hqdefault.jpg',
                'lectureDuration'=> 5107,
            ],
        ];

        foreach ($lectures as $lecture) {
            Lecture::updateOrCreate(
                ['lectureId' => $lecture['lectureId']],
                $lecture
            );
        }
    }
}
