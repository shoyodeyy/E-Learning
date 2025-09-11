<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class FeedbackController extends Controller
{
    public function index(Request $request, $eventId)
    {
        $role = $request->query('role');

        $query = Feedback::with('user')
            ->where('event_id', $eventId);

        if ($role) {
            $query->where('role', $role);
        }

        return response()->json($query->get());
    }

    public function store(Request $request, $eventId)
    {
        $userId = Auth::id();
        $event = Event::findOrFail($eventId);

        $event = Event::findOrFail($eventId);

        if (now()->lt($event->end_at)) {
            return response()->json(['message' => 'Feedback is only allowed after the event has ended.'], 403);
        }

        if (now()->gt($event->end_at->copy()->addWeek())) {
            return response()->json(['message' => 'Feedback is overdue (by only 1 week).'], 403);
        }

        $existingFeedback = Feedback::where('event_id', $eventId)
            ->where('user_id', $userId)
            ->first();

        if ($existingFeedback) {
            return response()->json(['message' => 'You have provided feedback on this event.'], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'comments' => 'nullable|string',
            'role' => 'required|in:participant,organizer',
        ]);

        $feedback = Feedback::create([
            'event_id' => $eventId,
            'user_id' => $userId,
            'role' => $validated['role'],
            'rating' => $validated['rating'],
            'comments' => $validated['comments'] ?? null,
            'submitted_on' => Carbon::now(),
        ]);

        return response()->json(['message' => 'Feedback successful', 'data' => $feedback], 201);
    }

    public function update(Request $request, $id)
    {
        $userId = Auth::id();
        $feedback = Feedback::where('feedback_id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        if ($feedback->edited) {
            return response()->json(['message' => 'You can only edit your feedback once.'], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'comments' => 'nullable|string',
        ]);

        $feedback->update([
            'rating' => $validated['rating'],
            'comments' => $validated['comments'] ?? $feedback->comments,
            'edited' => true,
        ]);

        return response()->json(['message' => 'Update successful', 'data' => $feedback]);
    }
}
