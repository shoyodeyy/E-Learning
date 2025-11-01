<?php

namespace App\Http\Controllers\Feedback;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Http\Controllers\Controller;

class FeedbackController extends Controller
{
    public function index(Request $request, $eventId)
    {
        $user = Auth::user();
        $event = Event::findOrFail($eventId);

        if ($event->status !== 'completed') {
            return response()->json(['message' => 'Feedback is only available for completed events.'], 403);
        }

        $registration = Registration::where([
            'event_id' => $eventId,
            'user_id' => $user->user_id
        ])->first();

        // Check if user is registered and attended
        if (!$registration || !in_array($registration->status, ['confirmed', 'waitlist']) || !$registration->attendance_status) {
            return response()->json(['message' => 'You must be a registered participant with attended status to view feedback.'], 403);
        }

        $query = Feedback::with(['user' => function ($q) {
            $q->select('user_id', 'name', 'avatar');
        }])->where('event_id', $eventId);

        if ($user->role === 'organizer') {
            $query->where('role', 'organizer');
        } else {
            $query->where('role', 'participant');
        }

        $feedbacks = $query->orderBy('submitted_on', 'desc')->get();

        return response()->json([
            'data' => $feedbacks,
            'can_submit' => $this->canSubmitFeedback($user, $event),
            'feedback_deadline' => $event->end_at->addWeek(),
            'user_feedback' => $this->getUserFeedback($user->user_id, $eventId)
        ]);
    }

    public function store(Request $request, $eventId)
    {
        $user = Auth::user();
        $event = Event::findOrFail($eventId);

        if ($event->status !== 'completed') {
            return response()->json(['message' => 'Feedback is only allowed for completed events.'], 403);
        }

        $registration = Registration::where([
            'event_id' => $eventId,
            'user_id' => $user->user_id,
        ])->first();

        if (!$registration || !in_array($registration->status, ['confirmed', 'waitlist'])) {
            return response()->json(['message' => 'You must be a registered participant to submit feedback.'], 403);
        }

        if (!$registration->attendance_status) {
            return response()->json(['message' => 'You must have attended the event to submit feedback.'], 403);
        }

        $feedbackDeadline = $event->end_at->addWeek();
        if (now()->gt($feedbackDeadline)) {
            return response()->json(['message' => 'Feedback period has expired (only allowed within 1 week after event completion).'], 403);
        }

        $existingFeedback = Feedback::where('event_id', $eventId)
            ->where('user_id', $user->user_id)
            ->first();

        if ($existingFeedback) {
            return response()->json(['message' => 'You have already provided feedback for this event.'], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'comments' => 'nullable|string|max:1000',
        ]);

        $feedback = Feedback::create([
            'event_id' => $eventId,
            'user_id' => $user->user_id,
            'role' => $user->role === 'organizer' ? 'organizer' : 'participant',
            'rating' => $validated['rating'],
            'comments' => $validated['comments'] ?? null,
            'submitted_on' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Feedback submitted successfully',
            'data' => $feedback->load('user:user_id,name,avatar')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $feedback = Feedback::where('feedback_id', $id)
            ->where('user_id', $user->user_id)
            ->firstOrFail();

        $event = Event::findOrFail($feedback->event_id);

        if ($event->status !== 'completed') {
            return response()->json(['message' => 'Cannot edit feedback for non-completed events.'], 403);
        }

        $registration = Registration::where([
            'event_id' => $feedback->event_id,
            'user_id' => $user->user_id,
        ])->first();

        if (!$registration || !in_array($registration->status, ['confirmed', 'waitlist'])) {
            return response()->json(['message' => 'You must be a registered participant to edit feedback.'], 403);
        }

        if (!$registration->attendance_status) {
            return response()->json(['message' => 'You must have attended the event to edit feedback.'], 403);
        }

        $feedbackDeadline = $event->end_at->addWeek();
        if (now()->gt($feedbackDeadline)) {
            return response()->json(['message' => 'Feedback editing period has expired.'], 403);
        }

        if ($feedback->edited) {
            return response()->json(['message' => 'You can only edit your feedback once.'], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'comments' => 'nullable|string|max:1000',
        ]);

        $feedback->update([
            'rating' => $validated['rating'],
            'comments' => $validated['comments'] ?? $feedback->comments,
            'edited' => true,
            'edited_at' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Feedback updated successfully',
            'data' => $feedback->load('user:user_id,name,avatar')
        ]);
    }

    private function canSubmitFeedback($user, $event)
    {
        if ($event->status !== 'completed') {
            return false;
        }

        $registration = Registration::where([
            'event_id' => $event->event_id,
            'user_id' => $user->user_id,
        ])->first();

        if (!$registration || !in_array($registration->status, ['confirmed', 'waitlist']) || !$registration->attendance_status) {
            return false;
        }

        if (now()->gt($event->end_at->addWeek())) {
            return false;
        }

        $existingFeedback = Feedback::where('event_id', $event->event_id)
            ->where('user_id', $user->user_id)
            ->exists();

        return !$existingFeedback;
    }

    private function getUserFeedback($userId, $eventId)
    {
        return Feedback::with('user:user_id,name,avatar')
            ->where('event_id', $eventId)
            ->where('user_id', $userId)
            ->first();
    }
}
