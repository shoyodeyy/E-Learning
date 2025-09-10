<?php

namespace Database\Seeders;

use App\Models\Course\Quiz;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quizzes = [
            [
                'quizId'         => 'Q001',
                'sectionId'      => 'S001',
                'quizTitle'      => 'Development Basics Quiz',
                'type'           => 'Quiz',
                'quizDescription'=> 'Test your knowledge of development basics.',
                'quizIndex'      => 1,
            ],
            [
                'quizId'         => 'Q002',
                'sectionId'      => 'S002',
                'quizTitle'      => 'Business Quiz',
                'type'           => 'Quiz',
                'quizDescription'=> 'Test your knowledge of business basics.',
                'quizIndex'      => 1,
            ],
            [
                'quizId'         => 'Q003',
                'sectionId'      => 'S003',
                'quizTitle'      => 'IT Basics Quiz',
                'type'           => 'Quiz',
                'quizDescription'=> 'Test your knowledge of IT fundamentals.',
                'quizIndex'      => 1,
            ],
        ];

        foreach ($quizzes as $quiz) {
            Quiz::updateOrCreate(
                ['quizId' => $quiz['quizId']],
                $quiz
            );
        }
    }
}
