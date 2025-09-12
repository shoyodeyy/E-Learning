<?php

namespace App\Http\Resources;

use App\Http\Resources\Course\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'eventId'              => $this->event_id,
            'title'                => $this->title,
            'description'          => $this->description,
            'category'             => $this->category,
            'start_at'             => $this->start_at,
            'duration_minutes'     => $this->duration_minutes,
            'end_at'               => $this->end_at,
            'venue'                => $this->venue,
            'organizerId'          => new UserResource($this->whenLoaded('organizer')),
            'approvedBy'           => new UserResource($this->whenLoaded('approvedByAdmin')),
            'maxParticipants'      => $this->maxParticipants,
            'registrationDeadline' => $this->registrationDeadline,
            'bannerImage'          => $this->bannerImage,
            'status'               => $this->status,
            'created_at'           => $this->created_at,
            'updated_at'           => $this->updated_at,
        ];
    }
}
