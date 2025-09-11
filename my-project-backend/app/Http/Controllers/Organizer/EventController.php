<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with(['organizer', 'approvedByAdmin'])
            ->orderBy('start_at', 'desc')
            ->paginate(10);

        return EventResource::collection($events);
    }

    public function show($id)
    {
        $event = Event::with(['organizer', 'approvedByAdmin'])
            ->where('event_id', $id)
            ->first();

        if (!$event) {
            return response()->json([
                'message' => 'Event not found'
            ], 404);
        }

        return new EventResource($event);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:Cultural Event,Technical Fests,Sports Meets,Annual Day Functions,Workshops and Seminars,Intercollegiate Competitions',
            'description' => 'nullable|string',
            'start_at' => 'required|date_format:Y-m-d H:i:s',
            'duration_minutes' => 'required|integer|min:1|max:1440',
            'venue' => 'required|string',
//            'organizerId' => 'required|integer|exists:users,user_id',
            'maxParticipants' => 'required|integer|min:1|max:10000',
            'registrationDeadline' => 'required|date_format:Y-m-d H:i:s',
            'bannerImage' => 'required|string',
        ]);

        $data['status'] = 'pending';
        $data['organizerId'] = auth()->id();

        $event = Event::create($data);

        return new EventResource($event);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
//         $user = auth()->user();

        // check status
        if (in_array($event->status, ['completed', 'cancelled'])) {
            return response()->json([
                'message' => 'Cannot update completed or cancelled events'
            ], 403);
        }

         // check role
//        if (!$user->hasRole('admin') && $user->user_id !== $event->organizerId) {
//            return response()->json([
//                'message' => 'You can only update your own events'
//            ], 403);
//        }

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|in:Cultural Event,Technical Fests,Sports Meets,Annual Day Functions,Workshops and Seminars,Intercollegiate Competitions',
            'description' => 'sometimes|nullable|string',
            'start_at' => 'sometimes|required|date_format:Y-m-d H:i:s',
            'duration_minutes' => 'sometimes|required|integer|min:1|max:1440',
            'venue' => 'sometimes|required|string',
            'organizerId' => 'sometimes|required|integer|exists:users,user_id',
            'maxParticipants' => 'sometimes|required|integer|min:1|max:10000',
            'registrationDeadline' => 'sometimes|required|date_format:Y-m-d H:i:s',
            'bannerImage' => 'sometimes|required|string',
        ]);

        $message = 'Event updated successfully.';
        $originalStatus = $event->status;

        $event->update($data);

//        if (!$user->hasRole('admin') && $originalStatus === 'approved' && $event->wasChanged()) {
//            $event->update([
//                'status' => 'pending',
//                'approvedBy' => null
//            ]);
//            $message = 'Event updated successfully. Status reset to pending for re-approval.';
//        }

        $event->load(['organizer', 'approvedByAdmin']);

        return response()->json([
            'message' => $message,
            'data' => new EventResource($event)
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $event = Event::findOrFail($id);
//        $user = auth()->user();

        // check status
        if (in_array($event->status, ['completed', 'cancelled'])) {
            return response()->json([
                'message' => 'Cannot delete completed or cancelled events'
            ], 403);
        }

        // check role
//        if ($user->hasRole('admin')) {
//            $event->delete();
//            return response()->json([
//                'message' => 'Event deleted successfully by admin.'
//            ], 200);
//        }

//        if ($user->user_id !== $event->organizerId) {
//            return response()->json([
//                'message' => 'You can only delete your own events'
//            ], 403);
//        }

        if ($event->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending events can be deleted'
            ], 403);
        }

        $event->delete();
        return response()->json([
            'message' => 'Event deleted successfully'
        ], 200);
    }
}
