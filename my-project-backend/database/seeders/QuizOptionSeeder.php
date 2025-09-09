<?php

namespace Database\Seeders;

use App\Models\Course\Option;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuizOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $options = [
            // Options for QTN001
            [
                'questionId' => 'QTN001',
                'optionText' => 'Process of creating software applications',
                'explainText' => '',
                'isCorrect'  => true,
            ],
            [
                'questionId' => 'QTN001',
                'optionText' => 'Playing video games',
                'explainText' => '',
                'isCorrect'  => false,
            ],
            [
                'questionId' => 'QTN001',
                'optionText' => 'Designing clothes',
                'explainText' => '',
                'isCorrect'  => false,
            ],

            // Options for QTN002
            [
                'questionId' => 'QTN002',
                'optionText' => 'French',
                'explainText' => '',
                'isCorrect'  => false,
            ],
            [
                'questionId' => 'QTN002',
                'optionText' => 'PHP',
                'explainText' => '',
                'isCorrect'  => true,
            ],
            [
                'questionId' => 'QTN002',
                'optionText' => 'Latin',
                'explainText' => '',
                'isCorrect'  => false,
            ],

            // Options for QTN003
            [
                'questionId' => 'QTN003',
                'optionText' => 'Generate profit',
                'explainText' => '',
                'isCorrect'  => true,
            ],
            [
                'questionId' => 'QTN003',
                'optionText' => 'Spend money"',
                'explainText' => '',
                'isCorrect'  => true,
            ],
            [
                'questionId' => 'QTN003',
                'optionText' => 'Ignore customers',
                'explainText' => '',
                'isCorrect'  => false,
            ],

            // Options for QTN004
            [
                'questionId' => 'QTN004',
                'optionText' => 'Sole proprietorship',
                'explainText' => '',
                'isCorrect'  => true,
            ],
            [
                'questionId' => 'QTN004',
                'optionText' => 'Solo sports',
                'explainText' => '',
                'isCorrect'  => false,
            ],
            [
                'questionId' => 'QTN004',
                'optionText' => 'Book club',
                'explainText' => '',
                'isCorrect'  => false,
            ],

            // Options for QTN005
            [
                'questionId' => 'QTN005',
                'optionText' => 'International Travel"',
                'explainText' => '',
                'isCorrect'  => false,
            ],
            [
                'questionId' => 'QTN005',
                'optionText' => 'Information Technology',
                'explainText' => '',
                'isCorrect'  => true,
            ],
            [
                'questionId' => 'QTN005',
                'optionText' => 'Internet Tools',
                'explainText' => '',
                'isCorrect'  => false,
            ],

            // Options for QTN006
            [
                'questionId' => 'QTN006',
                'optionText' => 'Microsoft Word',
                'explainText' => '',
                'isCorrect'  => true,
            ],
            [
                'questionId' => 'QTN006',
                'optionText' => 'Keyboard',
                'explainText' => '',
                'isCorrect'  => true,
            ],
            [
                'questionId' => 'QTN006',
                'optionText' => 'Monitor',
                'explainText' => '',
                'isCorrect'  => false,
            ],
        ];

        foreach ($options as $option) {
            Option::create($option);
        }
    }
}
