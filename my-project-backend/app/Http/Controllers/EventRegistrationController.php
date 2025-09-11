<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventRegistrationController extends Controller
{
    // Đăng ký event
    public function register(Request $request, $eventId)
    {
        $user = Auth::user();
        $event = Event::findOrFail($eventId);

        if ($event->status !== 'approved') {
            return response()->json(['error' => 'Event not open for registration'], 400);
        }

        if ($event->registration_deadline && now()->gt($event->registration_deadline)) {
            return response()->json(['error' => 'Registration deadline passed'], 400);
        }

        if (Registration::where('event_id', $eventId)->where('user_id', $user->user_id)->exists()) {
            return response()->json(['error' => 'You already registered'], 400);
        }

        $confirmedCount = Registration::where('event_id', $eventId)
            ->where('status', 'confirmed')
            ->count();

        $status = $confirmedCount < $event->max_participants ? 'confirmed' : 'waitlist';

        $registration = Registration::create([
            'event_id' => $eventId,
            'user_id' => $user->user_id,
            'status' => $status,
            'attendance_status' => false
        ]);

        // Notification::create([
        //     'user_id' => $user->user_id,
        //     'event_id' => $eventId,
        //     'message' => $status === 'confirmed'
        //         ? "Your registration for {$event->title} is confirmed."
        //         : "You are on waitlist for {$event->title}.",
        //     'type' => 'registration_confirm'
        // ]);

        return response()->json([
            'message' => $status === 'confirmed' ? 'Registration confirmed' : 'Added to waitlist',
            'status' => $status
        ]);
    }

    // Hủy đăng ký
    public function cancel($eventId)
    {
        $user = Auth::user();
        $registration = Registration::where('event_id', $eventId)
            ->where('user_id', $user->user_id)
            ->firstOrFail();

        $registration->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Registration cancelled']);
    }

    // Organizer đánh dấu tham dự bằng checkbox
    public function markAttendance(Request $request, $registrationId)
    {
        $registration = Registration::findOrFail($registrationId);

        $registration->update([
            'attendance_status' => $request->boolean('attendance_status')
        ]);

        return response()->json([
            'message' => 'Attendance updated',
            'attendance_status' => $registration->attendance_status
        ]);
    }

    // Lấy danh sách người đăng ký event (cho Organizer)
    public function listByEvent($eventId)
    {
        $registrations = Registration::with('user')
            ->where('event_id', $eventId)
            ->get();

        return response()->json($registrations);
    }
}
