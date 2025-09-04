<?php

namespace App\Http\Controllers\Student;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    // Danh sách tất cả khoá học
    public function courses()
    {
        $courses = Course::with('instructor')->get();
        return response()->json($courses);
    }

    // Enroll vào 1 course
    public function enroll($courseId)
    {
        $user = Auth::user();

        // Kiểm tra role
        if ($user->role !== 'student') {
            return response()->json(['error' => 'Chỉ student mới có thể enroll'], 403);
        }

        // Kiểm tra course tồn tại
        $course = Course::findOrFail($courseId);

        // Kiểm tra đã enroll chưa
        $exists = Enrollment::where('student_id', $user->id)
            ->where('course_id', $courseId)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Bạn đã enroll khoá học này rồi']);
        }

        Enrollment::create([
            'student_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'active'
        ]);

        return response()->json(['message' => 'Enroll thành công']);
    }

    // Danh sách khoá học đã enroll
    public function myCourses()
    {
        $user = Auth::user();

        $enrollments = Enrollment::with('course')
            ->where('student_id', $user->id)
            ->get();

        return response()->json($enrollments);
    }
}
