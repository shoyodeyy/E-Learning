<?php

namespace Database\Seeders;

use App\Models\Course\Category;
use App\Models\Course\Course;
use App\Models\Course\Section;
use App\Models\Course\Status;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ------------------- categories -------------------
        $categories = [
            [
                'categoryID' => 'CA01',
                'categoryName' => 'Development',
            ],
            [
                'categoryID' => 'CA02',
                'categoryName' => 'Business',
            ],
            [
                'categoryID' => 'CA03',
                'categoryName' => 'Finance & Accounting',
            ],
            [
                'categoryID' => 'CA04',
                'categoryName' => 'IT & Software',
            ],
            [
                'categoryID' => 'CA05',
                'categoryName' => 'Office Productivity',
            ],
            [
                'categoryID' => 'CA06',
                'categoryName' => 'Personal Development',
            ],
            [
                'categoryID' => 'CA07',
                'categoryName' => 'Design',
            ],
            [
                'categoryID' => 'CA08',
                'categoryName' => 'Marketing',
            ],
            [
                'categoryID' => 'CA09',
                'categoryName' => 'Lifestyle',
            ],
            [
                'categoryID' => 'CA10',
                'categoryName' => 'Photography & Video',
            ],
            [
                'categoryID' => 'CA11',
                'categoryName' => 'Health & Fitness',
            ],
            [
                'categoryID' => 'CA12',
                'categoryName' => 'Music',
            ],
            [
                'categoryID' => 'CA13',
                'categoryName' => 'Teaching & Academic',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['categoryID' => $category['categoryID']],
                $category
            );
        }


        // ------------------- statuses -------------------
        $statuses = [
            [
                'statusID' => 'ST01',
                'statusName' => 'draft',
            ],
            [
                'statusID' => 'ST02',
                'statusName' => 'pending',
            ],
            [
                'statusID' => 'ST03',
                'statusName' => 'rejected',
            ],
            [
                'statusID' => 'ST04',
                'statusName' => 'published',
            ],
            [
                'statusID' => 'ST05',
                'statusName' => 'unpublished',
            ]
        ];

        foreach ($statuses as $status) {
            Status::updateOrCreate(
                ['statusID' => $status['statusID']],
                $status
            );
        }


        // ------------------- courses -------------------
        $courses = [
            [
                'courseTitle' => 'Development Fundamentals',
                'courseDescription' => 'Learn the fundamentals of software development.',
                'price' => 49.99,
                'level' => 'Beginner',
                'badge' => 'bestseller',
                'categoryID' => 'CA01',
                'statusID' => 'ST01',
                'instructorID' => 2,
                'approvedBy' => 1,
                'avgRating' => 4.5,
                'totalStudents' => 120,
                'totalDuration' => 3273,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'courseTitle' => 'Everything for Business',
                'courseDescription' => 'Learn the essentials of business and management.',
                'price' => 59.99,
                'level' => 'Beginner',
                'badge' => 'hot',
                'categoryID' => 'CA02',
                'statusID' => 'ST01',
                'instructorID' => 2,
                'approvedBy' => 1,
                'avgRating' => 4.5,
                'totalStudents' => 120,
                'totalDuration' => 39607,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'courseTitle' => 'The Complete Guide to IT & Software Fundamentals',
                'courseDescription' => 'Learn the basics of IT and software systems.',
                'price' => 69.99,
                'level' => 'Beginner',
                'badge' => 'bestseller',
                'categoryID' => 'CA04',
                'statusID' => 'ST01',
                'instructorID' => 2,
                'approvedBy' => 1,
                'avgRating' => 4.5,
                'totalStudents' => 120,
                'totalDuration' => 6390,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($courses as $index => $course) {
            // auto generate courseID with format 'C001', 'C002', ...
            $courseID = 'C' . str_pad($index + 1, 3, '0', STR_PAD_LEFT);
            $course['courseID'] = $courseID;

            Course::updateOrCreate(
                ['courseID' => $course['courseID']],
                $course
            );
        }
    }
}
