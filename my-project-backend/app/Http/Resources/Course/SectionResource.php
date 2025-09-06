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
//            'items'         => ItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
