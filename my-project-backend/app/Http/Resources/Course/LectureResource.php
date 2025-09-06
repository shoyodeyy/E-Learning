<?php

namespace App\Http\Resources\Course;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LectureResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'itemId' => $this->lectureId,
            'type' => $this->type,
            'itemTitle' => $this->lectureTitle,
            'itemIndex' => $this->lectureIndex,
            'videoUrl' => $this->videoUrl,
            'videoFile' => $this->videoFile,
            'thumbnail' => $this->thumbnail,
            'duration' => $this->lectureDuration
        ];
    }
}
