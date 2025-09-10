<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Http\Resources\EventResource;
use App\Models\Event;
use http\Env\Request;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with(['organizer', 'approvedByAdmin'])->get();
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
            'eventDate' => 'required|date',
            'eventTime' => 'required|time|format:H:i',
            'venue' => 'required|string',
            'organizerId' => 'required|integer|exists:users,user_id',
            'maxParticipants' => 'required|integer|min:1',
            'registrationDeadline' => 'required|dateTime',
        ]);
    }
}
