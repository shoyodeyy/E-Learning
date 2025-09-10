<?php

namespace App\Http\Controllers;

use App\Models\Course\Course;
use App\Models\Course\Quiz;
use App\Models\Course\Section;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function store(Request $request, $sectionId): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'quizTitle' => 'required|string|max:255'
        ]);

        $section = Section::findOrFail($sectionId);

        // Lấy index kế tiếp
        $nextIndex = $section->quizzes()->count() + 1;

        $quiz = Quiz::create([
            'quizId' => $this->generateQuizId(),
            'sectionId' => $section->sectionId,
            'quizTitle' => $request->quizTitle,
            'quizIndex' => $nextIndex,
            'description' => null,
        ]);

        return response()->json([
            'message' => 'Quiz created successfully',
            'quiz' => $quiz
        ], 201);
    }

    public function update(Request $request, $sectionId, $quizId): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'quizTitle' => 'required|string|max:255',
            'quizDescription' => 'nullable|string',
        ]);

        $quiz = Quiz::where('quizId', $quizId)
            ->where('sectionId', $sectionId)
            ->firstOrFail();

        $quiz->update($data);

        return response()->json([
            'message' => 'Quiz updated successfully',
            'quiz' => $quiz
        ]);
    }

    public function destroy($sectionId, $quizId): \Illuminate\Http\JsonResponse
    {
        $quiz = Quiz::where('quizId', $quizId)
            ->where('sectionId', $sectionId)
            ->firstOrFail();

        $quiz->delete();

        return response()->json([
            'message' => 'Quiz deleted successfully'
        ], 200);
    }

    private function generateQuizId(): string
    {
        $lastQuiz = Quiz::orderBy('quizId', 'desc')->first();
        if (!$lastQuiz) {
            return 'Q001';
        }

        $lastNumber = (int) substr($lastQuiz->quizId, 1);
        return 'Q' . str_pad($lastNumber + 1, 3, "0", STR_PAD_LEFT);
    }
}
