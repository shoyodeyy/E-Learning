<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

        if ($event->registrationDeadline && now()->gt($event->registrationDeadline)) {
            return response()->json(['error' => 'Registration deadline passed'], 400);
        }

        return DB::transaction(function () use ($event, $eventId, $user) {
            $existing = Registration::where('event_id', $eventId)
                ->where('user_id', $user->user_id)
                ->lockForUpdate()
                ->first();

            if ($existing && in_array($existing->status, ['confirmed', 'waitlist'])) {
                return response()->json(['error' => 'You already registered'], 400);
            }

            $confirmedCount = Registration::where('event_id', $eventId)
                ->where('status', 'confirmed')
                ->lockForUpdate()
                ->count();

            $status = $confirmedCount < $event->maxParticipants ? 'confirmed' : 'waitlist';

            if ($existing && $existing->status === 'cancelled') {
                $existing->update([
                    'status' => $status,
                    // giữ nguyên registered_on hoặc cập nhật nếu cần:
                    // 'registered_on' => now(),
                ]);
            } else {
                Registration::create([
                    'event_id' => $eventId,
                    'user_id' => $user->user_id,
                    'status' => $status,
                    'attendance_status' => false
                ]);
            }

            return response()->json([
                'message' => $status === 'confirmed' ? 'Registration confirmed' : 'Added to waitlist',
                'status' => $status
            ]);
        });
    }

    // Hủy đăng ký
    public function cancel($eventId)
    {
        $user = Auth::user();

        return DB::transaction(function () use ($eventId, $user) {
            $registration = Registration::where('event_id', $eventId)
                ->where('user_id', $user->user_id)
                ->lockForUpdate()
                ->firstOrFail();

            // Nếu đã cancelled thì không cần làm gì thêm
            if ($registration->status !== 'cancelled') {
                $registration->update(['status' => 'cancelled']);

                // Đẩy người chờ sớm nhất lên confirmed nếu có
                $next = Registration::where('event_id', $eventId)
                    ->where('status', 'waitlist')
                    ->orderBy('registered_on', 'asc')
                    ->lockForUpdate()
                    ->first();

                if ($next) {
                    $next->update(['status' => 'confirmed']);
                }
            }

            return response()->json(['message' => 'Registration cancelled']);
        });
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

    // Trạng thái đăng ký của user hiện tại cho 1 event
    public function status($eventId)
    {
        $user = Auth::user();
        $registration = Registration::where('event_id', $eventId)
            ->where('user_id', $user->user_id)
            ->first();

        if (!$registration) {
            return response()->json([
                'registered' => false,
                'status' => null,
            ]);
        }

        return response()->json([
            'registered' => in_array($registration->status, ['confirmed', 'waitlist']),
            'status' => $registration->status,
        ]);
    }

    // Danh sách đăng ký của user hiện tại (cho trang My Registrations)
    public function myRegistrations(Request $request)
    {
        $user = Auth::user();
        $registrations = Registration::with('event')
            ->where('user_id', $user->user_id)
            ->orderByDesc('registered_on')
            ->get();

        // Chỉ trả về fields cần thiết để hiển thị
        $data = $registrations->map(function ($r) {
            return [
                'registration_id' => $r->registration_id,
                'event' => [
                    'event_id' => $r->event?->event_id,
                    'title' => $r->event?->title,
                    'start_at' => $r->event?->start_at,
                    'venue' => $r->event?->venue,
                ],
                'registered_on' => $r->registered_on,
                'status' => $r->status,
            ];
        });

        return response()->json($data);
    }
}
