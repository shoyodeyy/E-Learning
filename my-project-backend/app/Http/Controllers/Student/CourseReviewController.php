<?php

namespace App\Http\Controllers\Student;

use App\Models\CourseReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseReviewController extends Controller
{
    // Lấy danh sách review của 1 course
    public function index($courseId)
    {
        $reviews = CourseReview::with('student')
            ->where('course_id', $courseId)
            ->get();

        return response()->json($reviews);
    }

    // Student tạo review
    public function store(Request $request, $courseId)
    {
        $user = Auth::user();

        if ($user->role !== 'student') {
            return response()->json(['error' => 'only Student can review'], 403);
        }

        $review = CourseReview::create([
            'student_id' => $user->id,
            'course_id' => $courseId,
            'rating' => $request->input('rating', 0),
            'review_text' => $request->input('review_text', null),
        ]);

        return response()->json($review, 201);
    }
}

