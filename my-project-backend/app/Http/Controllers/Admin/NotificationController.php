<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->user_id)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'data' => $notifications
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('notification_id', $id)
            ->where('user_id', auth()->user()->user_id)
            ->firstOrFail();

        $notification->update(['is_read' => 1]);

        return response()->json([
            'message' => 'Notification marked as read',
            'data' => $notification
        ]);
    }

    public function markAllAsRead()
    {
        Notification::where('user_id', auth()->user()->user_id)
        ->update(['is_read' => 1]);

        return response()->json(['message' => 'All notifications marked as read']);
    }
}
