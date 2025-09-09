<?php

namespace Database\Seeders;

use App\Models\Course\Question;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuizQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            [
                'questionId'   => 'QTN001',
                'quizId'       => 'Q001',
                'questionText' => 'What is software development?',
            ],
            [
                'questionId'   => 'QTN002',
                'quizId'       => 'Q001',
                'questionText' => 'Which language is widely used in web development?',
            ],
            [
                'questionId'   => 'QTN003',
                'quizId'       => 'Q002',
                'questionText' => 'What is the main goal of a business?',
            ],
            [
                'questionId'   => 'QTN004',
                'quizId'       => 'Q002',
                'questionText' => 'Which of these is a type of business structure?',
            ],
            [
                'questionId'   => 'QTN005',
                'quizId'       => 'Q003',
                'questionText' => 'What does IT stand for?',
            ],
            [
                'questionId'   => 'QTN006',
                'quizId'       => 'Q003',
                'questionText' => 'Which is an example of software?',
            ],
        ];

        foreach ($questions as $question) {
            Question::updateOrCreate(
                ['questionId' => $question['questionId']],
                $question
            );
        }
    }
}
