<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Carbon\Carbon;

class OrganizerDashboardController extends Controller
{
    public function overview(Request $request)
    {
        $user = auth()->user();

        // Tổng số sự kiện của organizer
        $totalEvents = Event::where('organizerId', $user->user_id)->count();

        // Đếm số lượng sự kiện theo trạng thái
        $statusCounts = Event::where('organizerId', $user->user_id)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        // Tổng số người đăng ký trên tất cả sự kiện
        $totalRegistrations = Registration::whereIn('event_id', function ($query) use ($user) {
            $query->select('event_id')
                ->from('events')
                ->where('organizerId', $user->user_id);
        })->count();

        // Các sự kiện sắp diễn ra (start_at > hôm nay)
        $upcomingEvents = Event::where('organizerId', $user->user_id)
            ->where('start_at', '>', Carbon::now())
            ->orderBy('start_at', 'asc')
            ->take(5)
            ->get(['event_id', 'title', 'start_at', 'status', 'bannerImage']);

        // 5 sự kiện mới nhất (được tạo hoặc cập nhật)
        $recentEvents = Event::where('organizerId', $user->user_id)
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get(['event_id', 'title', 'start_at', 'status', 'updated_at']);

        return response()->json([
            'stats' => [
                'total_events' => $totalEvents,
                'total_registrations' => $totalRegistrations,
                'status_counts' => $statusCounts,
            ],
            'upcoming_events' => $upcomingEvents,
            'recent_events' => $recentEvents,
        ]);
    }
}
