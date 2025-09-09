<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserAnalyticsController extends Controller
{
    /**
     * Lấy thống kê người dùng theo thời gian
     */
    public function getStats(Request $request)
    {
        $period = $request->get('period', 'day'); // day, month, year
        $now = Carbon::now();

        // Xác định khoảng thời gian và format
        switch ($period) {
            case 'day':
                $days = 30;
                $format = '%Y-%m-%d';
                $dateFormat = 'Y-m-d';
                $labelFormat = 'd/m';
                break;
            case 'month':
                $days = 12;
                $format = '%Y-%m';
                $dateFormat = 'Y-m';
                $labelFormat = 'm/Y';
                break;
            case 'year':
                $days = 5;
                $format = '%Y';
                $dateFormat = 'Y';
                $labelFormat = 'Y';
                break;
            default:
                $days = 30;
                $format = '%Y-%m-%d';
                $dateFormat = 'Y-m-d';
                $labelFormat = 'd/m';
        }

        $stats = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = $period === 'day'
                ? $now->copy()->subDays($i)
                : ($period === 'month'
                    ? $now->copy()->subMonths($i)->startOfMonth()
                    : $now->copy()->subYears($i)->startOfYear());

            $nextDate = $period === 'day'
                ? $date->copy()->addDay()
                : ($period === 'month'
                    ? $date->copy()->addMonth()
                    : $date->copy()->addYear());

            // Lấy số lượng users mới trong khoảng thời gian này
            $newUsers = User::whereBetween('created_at', [$date, $nextDate])->count();

            // Lấy tổng số users đến thời điểm này
            $totalUsers = User::where('created_at', '<=', $nextDate)->count();

            // Lấy số users đã verify email trong khoảng thời gian này
            $verifiedUsers = User::whereBetween('created_at', [$date, $nextDate])
                ->whereNotNull('email_verified_at')
                ->count();

            // Lấy số users đăng nhập Google trong khoảng thời gian này
            $googleUsers = User::whereBetween('created_at', [$date, $nextDate])
                ->whereNotNull('google_id')
                ->count();

            // Lấy số users bị ban trong khoảng thời gian này
            $bannedUsers = User::whereBetween('created_at', [$date, $nextDate])
                ->whereNotNull('banned_until')
                ->where('banned_until', '>', now())
                ->count();

            $stats[] = [
                'period' => $date->format($labelFormat),
                'date' => $date->format($dateFormat),
                'newUsers' => $newUsers,
                'totalUsers' => $totalUsers,
                'verifiedUsers' => $verifiedUsers,
                'googleUsers' => $googleUsers,
                'bannedUsers' => $bannedUsers,
            ];
        }

        return response()->json([
            'stats' => $stats,
            'period_type' => $period
        ]);
    }

    /**
     * Lấy thống kê tổng quan
     */
    public function getOverview()
    {
        $totalUsers = User::count();
        $verifiedUsers = User::whereNotNull('email_verified_at')->count();
        $googleUsers = User::whereNotNull('google_id')->count();
        $bannedUsers = User::whereNotNull('banned_until')
            ->where('banned_until', '>', now())
            ->count();

        // Thống kê theo role
        $roleStats = User::select('role', DB::raw('count(*) as count'))
            ->groupBy('role')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->role => $item->count];
            });

        // Tính tỷ lệ tăng trưởng so với tháng trước
        $currentMonth = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $lastMonth = User::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();

        $growthRate = $lastMonth > 0
            ? round((($currentMonth - $lastMonth) / $lastMonth) * 100, 1)
            : ($currentMonth > 0 ? 100 : 0);

        return response()->json([
            'overview' => [
                'totalUsers' => $totalUsers,
                'verifiedUsers' => $verifiedUsers,
                'googleUsers' => $googleUsers,
                'bannedUsers' => $bannedUsers,
                'growthRate' => $growthRate,
                'currentMonthUsers' => $currentMonth,
                'lastMonthUsers' => $lastMonth,
                'roleStats' => $roleStats
            ],
        ]);
    }

    /**
     * Lấy danh sách users gần đây
     */
    public function getRecentUsers(Request $request)
    {
        $limit = $request->get('limit', 10);

        $users = User::select(['id', 'name', 'email', 'role', 'google_id', 'email_verified_at', 'banned_until', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'isGoogleUser' => !is_null($user->google_id),
                    'isVerified' => !is_null($user->email_verified_at),
                    'isBanned' => !is_null($user->banned_until) && $user->banned_until > now(),
                    'created_at' => $user->created_at->format('d/m/Y H:i'),
                ];
            });

        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * Lấy thống kê users theo thời gian trong ngày (24h)
     */
    public function getHourlyStats()
    {
        $stats = [];

        for ($hour = 0; $hour < 24; $hour++) {
            $count = User::whereRaw('HOUR(created_at) = ?', [$hour])
                ->whereDate('created_at', '>=', now()->subDays(7)) // 7 ngày gần đây
                ->count();

            $stats[] = [
                'hour' => sprintf('%02d:00', $hour),
                'users' => $count
            ];
        }

        return response()->json([
            'hourlyStats' => $stats
        ]);
    }
}
