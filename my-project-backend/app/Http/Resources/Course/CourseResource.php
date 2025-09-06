<?php

namespace App\Http\Resources\Course;

use App\Http\Resources\User\AdminResource;
use App\Http\Resources\User\InstructorResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'courseID' => $this->courseID,
            'courseTitle' => $this->courseTitle,
            'courseDescription' => $this->courseDescription,
            'price' => $this->price,
            'level' => $this->level,
            'badge' => $this->badge,

            'category' => new CategoryResource($this->whenLoaded('category')),
            'status' => new StatusResource($this->whenLoaded('status')),
            'instructor' => new InstructorResource($this->whenLoaded('instructor')),
            'approvedBy' => new AdminResource($this->whenLoaded('approvedByAdmin')),
            'sections' => SectionResource::collection($this->whenLoaded('section')),

            'avgRating' => $this->avgRating,
            'totalStudents' => $this->totalStudents,
            'totalDuration' => $this->totalDuration
        ];
    }
}
