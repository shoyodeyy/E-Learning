<?php

namespace App\Http\Resources\Course;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'sectionId'     => $this->sectionId,
            'sectionTitle'  => $this->sectionTitle,
            'sectionIndex'  => $this->sectionIndex,
            'totalDuration' => $this->totalDuration,
            'items' => collect()
                ->merge($this->resource->relationLoaded('lectures')
                    ? LectureResource::collection($this->lectures)
                    : collect()
                )
                ->merge($this->resource->relationLoaded('quizzes')
                    ? QuizResource::collection($this->quizzes)
                    : collect()
                )
                ->sortBy('itemIndex')
                ->values(),
        ];
    }
}
