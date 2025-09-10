<?php

namespace App\Http\Controllers;

use App\Models\Course\Course;
use App\Models\Course\Lecture;
use App\Models\Course\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    /**
     * List all sections of a course
     */
    public function index($courseId): \Illuminate\Http\JsonResponse
    {
        $course = Course::findOrFail($courseId);
        $sections = $course->sections()->orderBy('index')->get();

        return response()->json([
            'data' => $sections
        ]);
    }

    /**
     * Show a specific section
     */
    public function show($courseId, $sectionId): \Illuminate\Http\JsonResponse
    {
        $course = Course::findOrFail($courseId);
        $section = $course->sections()->findOrFail($sectionId);

        return response()->json([
            'data' => $section
        ]);
    }

    /**
     * Create a new section for a course
     */
    public function store(Request $request, $courseId): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'sectionTitle' => 'required|string|max:255',
        ]);

        $course = Course::findOrFail($courseId);

        $nextIndex = $course->sections()->count() + 1;

        $section = Section::create([
            'sectionId' => $this->generateSectionId(),
            'courseId' => $course->courseID,
            'sectionTitle' => $request->sectionTitle,
            'sectionIndex' => $nextIndex,
            'totalDuration' => 0
        ]);

        return response()->json([
            'message' => 'Section created successfully',
            'section' => $section
        ], 201);
    }

    /**
     * Update a section
     */
    public function update(Request $request, $courseId, $sectionId): \Illuminate\Http\JsonResponse
    {
        $request->validate([
           'sectionTitle' => 'sometimes|required|string|max:255',
           'sectionIndex' => 'sometimes|required|integer|min:1',
        ]);

        $course = Course::findOrFail($courseId);
        $section = $course->sections()->findOrFail($sectionId);

        $section->update($request->only(['sectionTitle', 'sectionIndex']));

        return response()->json([
            'message' => 'Section updated successfully',
            'section' => $section
        ]);
    }

    /**
     * Delete a section
     */
    public function destroy($courseId, $sectionId): \Illuminate\Http\JsonResponse
    {
        $course = Course::findOrFail($courseId);
        $section = $course->sections()->findOrFail($sectionId);

        $section->delete();

        return response()->json([
            'message' => 'Section deleted successfully'
        ]);
    }

    private function generateSectionId(): string
    {
        $lastSection = Section::orderBy('sectionId', 'desc')->first();
        if (!$lastSection) {
            return 'S001';
        }

        $lastNumber = (int) substr($lastSection->sectionId, 1);
        return 'S' . str_pad($lastNumber + 1, 3, "0", STR_PAD_LEFT);
    }
}
