<?php

namespace App\Http\Resources\Course;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'itemId' => $this->quizId,
            'type' => $this->type,
            'itemTitle' => $this->quizTitle,
            'itemIndex' => $this->quizIndex,
            'description' => $this->quizDescription,
            'questions' => QuizQuestionResource::collection($this->whenLoaded('questions')),
        ];
    }
}
