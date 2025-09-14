<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use App\Models\Notification;
use App\Models\RegistrationSeat;
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

        $seats = $request->input('seats', []); // mảng ghế client chọn

        if (empty($seats)) {
            return response()->json(['error' => 'No seats selected'], 400);
        }

        if ($event->status !== 'approved') {
            return response()->json(['error' => 'Event not open for registration'], 400);
        }

        if ($event->registrationDeadline && now()->gt($event->registrationDeadline)) {
            return response()->json(['error' => 'Registration deadline passed'], 400);
        }

        return DB::transaction(function () use ($event, $eventId, $user, $seats) {
            $existing = Registration::where('event_id', $eventId)
                ->where('user_id', $user->user_id)
                ->lockForUpdate()
                ->first();

            if ($existing && in_array($existing->status, ['confirmed', 'waitlist'])) {
                return response()->json(['error' => 'You already registered'], 400);
            }

            // Check ghế có ai giữ chưa
            $occupiedSeats = RegistrationSeat::whereHas('registration', function ($q) use ($eventId) {
                $q->where('event_id', $eventId)->whereIn('status', ['confirmed', 'waitlist']);
            })
                ->whereIn('seat_number', $seats)
                ->pluck('seat_number')
                ->toArray();

            if (!empty($occupiedSeats)) {
                return response()->json([
                    'error' => 'Some seats are already taken',
                    'occupied' => $occupiedSeats
                ], 400);
            }

            $confirmedCount = Registration::where('event_id', $eventId)
                ->where('status', 'confirmed')
                ->lockForUpdate()
                ->count();

            $status = $confirmedCount < $event->maxParticipants ? 'confirmed' : 'waitlist';

            if ($existing && $existing->status === 'cancelled') {
                $existing->update([
                    'status' => $status,
                    'registered_on' => $existing->registered_on ?: now()
                ]);
                $registration = $existing;
            } else {
                $registration = Registration::create([
                    'event_id' => $eventId,
                    'user_id' => $user->user_id,
                    'status' => $status,
                    'attendance_status' => false,
                    'registered_on' => now()
                ]);
            }

            // Lưu seats
            foreach ($seats as $seat) {
                $registration->seats()->create(['seat_number' => $seat]);
            }

            return response()->json([
                'message' => $status === 'confirmed' ? 'Registration confirmed' : 'Added to waitlist',
                'status' => $status,
                'seats'  => $seats
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

                // xóa ghế
                $registration->seats()->delete();

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
        $user = Auth::user();
        $registration = Registration::with('event')->findOrFail($registrationId);
        
        // Kiểm tra event có thuộc về organizer này không
        if ($registration->event->organizerId !== $user->user_id) {
            return response()->json([
                'message' => 'You do not have permission to update attendance for this event'
            ], 403);
        }

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
        $user = Auth::user();
        
        // Kiểm tra event có tồn tại và thuộc về organizer này không
        $event = Event::where('event_id', $eventId)
            ->where('organizerId', $user->user_id)
            ->first();
            
        if (!$event) {
            return response()->json([
                'message' => 'Event not found or you do not have permission to view this event',
                'debug' => [
                    'requested_id' => $eventId,
                    'user_id' => $user->user_id,
                    'user_role' => $user->role
                ]
            ], 404);
        }

        $registrations = Registration::with(['user', 'seats'])
            ->where('event_id', $eventId)
            ->orderBy('registered_on', 'desc')
            ->get();

        return response()->json($registrations);
    }

    // Trạng thái đăng ký của user hiện tại cho 1 event
    public function status($eventId)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'registered' => false,
                'status' => null,
            ]);
        }

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

    // Lấy danh sách ghế đã được đăng ký cho 1 event
    public function seats($eventId)
    {
        $occupied = RegistrationSeat::whereHas('registration', function ($q) use ($eventId) {
            $q->where('event_id', $eventId)->whereIn('status', ['confirmed', 'waitlist']);
        })
            ->pluck('seat_number');

        return response()->json([
            'occupiedSeats' => $occupied
        ]);
    }

    // Lấy số ghế trống cho 1 event
    public function availableSeats($eventId)
    {
        $event = Event::findOrFail($eventId);

        $occupiedCount = RegistrationSeat::whereHas('registration', function ($q) use ($eventId) {
            $q->where('event_id', $eventId)->whereIn('status', ['confirmed', 'waitlist']);
        })->count();

        $available = max(0, $event->maxParticipants - $occupiedCount);

        return response()->json([
            'event_id' => $eventId,
            'maxParticipants' => $event->maxParticipants,
            'occupiedSeats' => $occupiedCount,
            'availableSeats' => $available
        ]);
    }
}
