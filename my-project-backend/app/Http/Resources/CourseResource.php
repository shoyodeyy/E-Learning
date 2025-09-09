<?php

namespace App\Http\Resources;

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

            'category' => $this->whenLoaded('category', function () {
                return [
                    'categoryID' => $this->category->categoryID,
                    'categoryName' => $this->category->categoryName,
                ];
            }),

            'status' => $this->whenLoaded('status', function () {
                return [
                    'statusID' => $this->status->statusID,
                    'statusName' => $this->status->statusName,
                ];
            }),

            'instructor' => $this->whenLoaded('instructor', function () {
                return [
                    'instructorID' => $this->instructor->id,
                    'instructorName' => $this->instructor->name,
                ];
            }),

            'approvedBy' => $this->whenLoaded('approvedByAdmin', function () {
                return [
                    'adminID' => $this->approvedByAdmin->id,
                    'adminName' => $this->approvedByAdmin->name,
                ];
            }),

            'avgRating' => $this->avgRating,
            'totalStudents' => $this->totalStudents,
        ];
    }
}
