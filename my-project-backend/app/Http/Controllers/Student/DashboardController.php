<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use App\Models\UserSavedMedia;
use App\Models\Feedback;
use Illuminate\Support\Facades\Auth;
use App\Models\Event;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $userId = Auth::id();

        $totalEventsAttended = Registration::where('user_id', $userId)
            ->where('attendance_status', true)
            ->count();

        $upcomingRegistrations = Registration::where('user_id', $userId)
            ->where('status', 'confirmed')
            ->whereHas('event', fn($q) => $q->where('start_at', '>', now()))
            ->count();

        $eventsSaved = UserSavedMedia::where('user_id', $userId)->count();

        $communityContributions = Feedback::where('user_id', $userId)->count();

        // Nếu tất cả bằng 0 thì trả null
        if($totalEventsAttended + $upcomingRegistrations + $eventsSaved + $communityContributions === 0) {
            return response()->json(null);
        }

        return response()->json([
            'totalEventsAttended' => $totalEventsAttended,
            'upcomingRegistrations' => $upcomingRegistrations,
            'eventsSaved' => $eventsSaved,
            'communityContributions' => $communityContributions,
        ]);
    }

    public function recentActivities()
    {
        $userId = Auth::id();

        $registrations = Registration::with('event')
            ->where('user_id', $userId)
            ->latest('registered_on')
            ->take(5)
            ->get()
            ->map(fn($r) => [
                'type' => 'registration',
                'title' => "You registered for " . $r->event->title,
                'time' => $r->registered_on,
                'icon' => '✅',
            ]);

        $feedbacks = Feedback::with('event')
            ->where('user_id', $userId)
            ->latest('submitted_on')
            ->take(5)
            ->get()
            ->map(fn($f) => [
                'type' => 'feedback',
                'title' => "Feedback submitted for " . $f->event->title,
                'time' => $f->submitted_on,
                'icon' => '📝',
            ]);

        $activities = $registrations
            ->merge($feedbacks)
            ->sortByDesc('time')
            ->take(5)
            ->map(function ($a) {
                $a['time'] = $a['time'] ? $a['time']->diffForHumans() : '';
                return $a;
            })
            ->values();

        return response()->json($activities);

    }

    public function upcomingEvents()
    {
        $upcoming = Event::where('start_at', '>', Carbon::now())
            ->orderBy('start_at', 'asc')
            ->take(5)
            ->get()
            ->map(fn($e) => [
                'id' => $e->event_id,
                'title' => $e->title,
                'date' => Carbon::parse($e->start_at)->format('F d, Y'),
                'time' => Carbon::parse($e->start_at)->format('h:i A'),
                'location' => $e->venue,
                'image' => $e->bannerImage ?? null,
            ]);

        return response()->json($upcoming);

    }
}
