<?php

namespace App\Http\Resources\Course;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

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
            'videoFile' => $this->videoFile
                ? asset('storage/' . ltrim($this->videoFile, '/'))
                : null,
            'videoName' => $this->videoName,
            'thumbnail' => $this->thumbnail
                ? (Str::startsWith($this->thumbnail, ['http://', 'https://'])
                    ? $this->thumbnail
                    : asset('storage/' . ltrim($this->thumbnail, '/')))
                : null,
            'duration' => $this->lectureDuration
        ];
    }

}
