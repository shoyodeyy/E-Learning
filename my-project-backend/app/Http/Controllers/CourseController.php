<?php

namespace App\Http\Controllers;

use App\Http\Resources\Course\CourseResource;
use App\Models\Course\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CourseController
{
    public function index(): AnonymousResourceCollection
    {
        $courses = Course::with([
            'instructor',
            'approvedByAdmin',
            'category',
            'status',
            'section'
        ])->get();
        return CourseResource::collection($courses);
    }

    public function show($id): CourseResource|\Illuminate\Http\JsonResponse
    {
        $course = Course::with([
            'instructor',
            'approvedByAdmin',
            'category',
            'status',
            'section'
        ])->where('courseID', $id)->firstOrFail();

        return new CourseResource($course);
    }

    public function store(Request $request): CourseResource|\Illuminate\Http\JsonResponse
    {
        try {
            $data = $request->validate([
                'courseTitle' => 'required|string|max:255',
                'categoryID' => 'required|exists:categories,categoryID',
                'courseDescription' => 'nullable|string',
                'price' => 'nullable|numeric',
                'level' => 'nullable|in:Beginner,Intermediate,Advanced',
                'statusID' => 'nullable|exists:statuses,statusID',
                'badge' => 'nullable|in:bestseller,featured,new,hot,sale',
                'instructorID' => 'nullable|exists:users,id',
                'approvedBy' => 'nullable|exists:users,id',
                'avgRating' => 'nullable|numeric|min:0|max:5',
                'totalStudents' => 'nullable|integer',
                'totalDuration' => 'nullable|integer|min:0',
            ]);

            $data['courseID'] = $this->generateCourseID();
            $data['statusID'] = 'ST01'; // draft

            $course = Course::create($data);

            return new CourseResource($course);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'errors' => $e->getMessage()
            ], 422);
        } catch (\Exception $e) {
            \Log::error($e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return response()->json([
                "message" => "Internal Server Error",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    private function generateCourseID(): string
    {
        $lastCourse = Course::orderBy('courseID', 'desc')->first();
        if (!$lastCourse) {
            return "C001";
        }

        $lastNumber = (int) substr($lastCourse->courseID, 3);
        $nextNumber = $lastNumber + 1;

        return 'C' . str_pad($nextNumber, 3, "0", STR_PAD_LEFT);
    }
}
