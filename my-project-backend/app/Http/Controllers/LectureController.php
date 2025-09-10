<?php

namespace App\Http\Controllers;

use App\Models\Course\Lecture;
use App\Models\Course\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LectureController extends Controller
{
    /**
     * Hiển thị danh sách lectures của một section
     */
    public function index($sectionId) {
        $section = Section::with('lectures')
            ->where('sectionId', $sectionId)
            ->firstOrFail();

        return response()->json([
            'sectionId' => $section->sectionId,
            'sectionTitle' => $section->sectionTitle,
            'lectures' => $section->lectures
        ]);
    }

    /**
     * Tạo mới Lecture trong môt section
     */
    public function store(Request $request, $sectionId) {
        $data = $request->validate([
           'lectureTitle' => 'required|string|max:255',
            'videoUrl' => 'nullable|url',
            'videoFile' => 'nullable|file|mimes:mp4,mov,avi,wmv|max:4096000', // 4GB
            'videoName' => 'nullable|string|max:255',
            'thumbnail' => 'nullable',
            'lectureDuration' => 'nullable|integer|min:0',
        ]);

        $section = Section::where('sectionId', $sectionId)->firstOrFail();
        $lastIndex = $section->lectures()->max('lectureIndex') ?? 0;

        $lecture = $section->lectures()->create([
            'lectureId' => $this->generateLectureId(),
            'lectureTitle' => $data['lectureTitle'],
            'lectureIndex' => $lastIndex + 1,
            'videoUrl' => $data['videoUrl'] ?? null,
            'videoFile' => $data['videoFile'] ?? null,
            'videoName' => $data['videoName'] ?? null,
            'thumbnail' => $data['thumbnail'] ?? null,
            'lectureDuration' => $data['lectureDuration'] ?? 0,
        ]);

        $section->increment('totalDuration', $lecture->lectureDuration);
        $course = $section->course;
        $course->increment('totalDuration', $lecture->lectureDuration);

        return response()->json([
            'message' => 'Lecture created successfully',
            'lecture' => $lecture
        ], 201);
    }

    /**
     * Lấy chi tiết 1 Lecture
     */
    public function show($lecureId) {
        $lecture = Lecture::where('lectureId', $lecureId)->firstOrFail();
        return response()->json($lecture);
    }

    /**
     * Cập nhật 1 Lecture
     */
    public function update(Request $request, $sectionId, $lectureId) {
        $data = $request->validate([
            'lectureTitle' => 'sometimes|required|string|max:255',
            'videoUrl' => 'nullable|url',
            'videoFile' => 'nullable|file|mimes:mp4,mov,avi,wmv|max:4096000', // 4GB
            'videoName' => 'nullable|string|max:255',
            'thumbnail' => 'nullable',
            'lectureDuration' => 'nullable|integer|min:0',
        ]);

        $lecture = Lecture::where('lectureId', $lectureId)
            ->where('sectionId', $sectionId)
            ->firstOrFail();

        $course = $lecture->section->course;
        $section = $lecture->section;

        $oldDuration = $lecture->lectureDuration ?? 0;

        // basePath
        $courseId = $lecture->section->courseID;
        $basePath = "course-video-files/{$courseId}/{$sectionId}/{$lectureId}";

        /**
         * Xử lý thumbnail
         */
        if ($request->hasFile('thumbnail')) {
            // xóa thumbnail cũ nếu có
            if ($lecture->thumbnail && Storage::disk('public')->exists($lecture->thumbnail)) {
                Storage::disk('public')->delete($lecture->thumbnail);
            }

            // lưu thumbnail mới
            $thumbPath = $request->file('thumbnail')->storeAs(
                "$basePath/thumbnail",
                "thumbnail.png",
                'public'
            );
            $data['thumbnail'] = $thumbPath;
        }
        // Nếu thumbnail là string URL -> giữ nguyên
        elseif ($request->filled('thumbnail')) {
            $data['thumbnail'] = $request->input('thumbnail');
        }

        /**
         * Xử lý videoFile
         */
        if ($request->hasFile('videoFile')) {
            // Xoá file video cũ nếu có
            if ($lecture->videoFile && Storage::disk('public')->exists($lecture->videoFile)) {
                Storage::disk('public')->delete($lecture->videoFile);
            }

            // Lưu file video mới
            $videoFile = $request->file('videoFile');
            $videoPath = $videoFile->storeAs(
                "$basePath/video",
                $videoFile->getClientOriginalName(),
                'public'
            );

            $data['videoFile'] = $videoPath;
            $data['videoName'] = $videoFile->getClientOriginalName();
        }

        $lecture->update($data);

        // ✅ Update lại totalDuration (trừ cũ, cộng mới)
        $newDuration = $lecture->lectureDuration ?? 0;

        $section->totalDuration = max(0, $section->totalDuration - $oldDuration + $newDuration);
        $section->save();

        $course->totalDuration = max(0, $course->totalDuration - $oldDuration + $newDuration);
        $course->save();

        return response()->json([
            "message" => "Lecture updated successfully",
            "lecture" => $lecture
        ]);
    }

    /**
     * Xóa 1 lecture
     */
    public function destroy($sectionId, $lectureId)
    {
        $lecture = Lecture::where('lectureId', $lectureId)
            ->where('sectionId', $sectionId)
            ->firstOrFail();

        $course = $lecture->section->course;

        // ✅ Trừ duration trước khi xóa
        $course->totalDuration = max(0, $course->totalDuration - ($lecture->lectureDuration ?? 0));
        $course->save();

        // Xóa file
        if ($lecture->videoFile && Storage::disk('public')->exists($lecture->videoFile)) {
            Storage::disk('public')->delete($lecture->videoFile);
        }
        if ($lecture->thumbnail && Storage::disk('public')->exists($lecture->thumbnail)) {
            Storage::disk('public')->delete($lecture->thumbnail);
        }

        $lecture->delete();

        return response()->json([
            'message' => 'Lecture deleted successfully'
        ]);
    }

    /**
     * Function tạo lectureId tự động
     */
    public function generateLectureId() {
        $lastLecture = Lecture::orderBy('lectureId', 'desc')->first();
        if (!$lastLecture) {
            return 'L001';
        }

        $lastNumber = (int) substr($lastLecture->lectureId, 1);
        return 'L' . str_pad($lastNumber + 1, 3, "0", STR_PAD_LEFT);
    }
}
