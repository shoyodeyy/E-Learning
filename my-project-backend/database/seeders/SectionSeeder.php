<?php

namespace Database\Seeders;

use App\Models\Course\Section;
use Illuminate\Database\Seeder;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ------------------- sections -------------------
        $sections = [
            [
                'sectionId'     => 'S001',
                'courseID'      => 'C001',
                'sectionTitle'  => 'Introduction',
                'sectionIndex'  => 1,
                'totalDuration' => 3273,
            ],
            [
                'sectionId'     => 'S002',
                'courseID'      => 'C002',
                'sectionTitle'  => 'Introduction to Business',
                'sectionIndex'  => 1,
                'totalDuration' => 39607,
            ],
            [
                'sectionId'     => 'S003',
                'courseID'      => 'C003',
                'sectionTitle'  => 'Getting Started with IT',
                'sectionIndex'  => 1,
                'totalDuration' => 6390,
            ],
        ];

        foreach ($sections as $section) {
            Section::updateOrCreate(
                ['sectionId' => $section['sectionId']],
                $section
            );
        }
    }
}
