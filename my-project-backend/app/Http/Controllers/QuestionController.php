<?php

namespace App\Http\Controllers;

use App\Models\Course\Question;
use App\Models\Course\Option;
use App\Models\Course\Quiz;
use App\Models\Course\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{
    public function store(Request $request, $sectionId, $quizId): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'questionText' => 'required|string|max:1000',
            'options' => 'required|array|min:2',
            'options.*.optionText' => 'required|string|max:255',
            'options.*.explainText' => 'nullable|string|max:1000',
            'options.*.isCorrect' => 'required|boolean',
        ]);

        $section = Section::where('sectionId', $sectionId)->firstOrFail();
        $quiz = Quiz::where('quizId', $quizId)
            ->where('sectionId', $sectionId)
            ->firstOrFail();

        try {
            DB::beginTransaction();

            $question = Question::create([
                'questionId' => $this->generateQuestionId(),
                'quizId' => $quizId,
                'questionText' => $data['questionText'],
            ]);

            $optionsCreated = [];
            foreach ($data['options'] as $opt) {
                $option = $question->options()->create([
                    'optionText' => $opt['optionText'],
                    'explainText' => $opt['explainText'] ?? null,
                    'isCorrect' => $opt['isCorrect'],
                ]);
                $optionsCreated[] = $option;
            }

            DB::commit();

            // Load options để trả về frontend
            $question->setRelation('options', collect($optionsCreated));

            return response()->json([
                'message' => 'Question created successfully',
                'question' => $question
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create question',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($sectionId, $quizId, $questionId): \Illuminate\Http\JsonResponse
    {
        $quiz = Quiz::where('quizId', $quizId)
            ->where('sectionId', $sectionId)
            ->firstOrFail();

        $question = $quiz->questions()->where('questionId', $questionId)->firstOrFail();

        $question->delete();

        return response()->json([
            'message' => 'Question deleted successfully'
        ], 200);
    }

    private function generateQuestionId(): string
    {
        $lastQuestion = Question::orderBy('questionId', 'desc')->first();
        if (!$lastQuestion) return 'QTN001';
        $lastNumber = (int) substr($lastQuestion->questionId, 3);
        return 'QTN' . str_pad($lastNumber + 1, 3, "0", STR_PAD_LEFT);
    }
}
