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
            'status_display'       => $this->getStatusDisplay(),
            'can_be_approved'      => $this->canBeApproved(),
            'is_pending'           => $this->isPending(),
            'is_approved'          => $this->isApproved(),
            'is_rejected'          => $this->isRejected(),
            'needs_approval'       => $this->needsApproval(),
            'latest_approval'      => $this->whenLoaded('latestApproval', function() {
                return $this->latestApproval ? [
                    'approval_id' => $this->latestApproval->approval_id,
                    'action_type' => $this->latestApproval->action_type,
                    'approval_type' => $this->latestApproval->approval_type,
                    'notes' => $this->latestApproval->notes,
                    'approved_at' => $this->latestApproval->approved_at,
                    'approver' => new UserResource($this->latestApproval->approver)
                ] : null;
            }),
            'created_at'           => $this->created_at,
            'updated_at'           => $this->updated_at,
        ];
    }
}
