<?php

namespace App\Http\Resources\Course;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizQuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'questionId'   => $this->questionId,
            'questionText' => $this->questionText,
            'options' => QuizOptionResource::collection($this->whenLoaded('options'))
        ];
    }
}
