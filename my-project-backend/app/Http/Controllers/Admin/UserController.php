<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\UserBannedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    /**
     * Lấy danh sách user (student + instructor) có search & paginate
     */
    public function index(Request $request)
    {
        $query = User::query()->whereIn('role', ['student', 'instructor']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'banned') {
                $query->whereNotNull('banned_until');
            } elseif ($request->status === 'active') {
                $query->whereNull('banned_until');
            }
        }

        $sortField = $request->get('sortField', 'id');
        $sortDirection = $request->get('sortDirection', 'asc');
        $allowedSortFields = ['id', 'name', 'email', 'role', 'created_at'];

        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'id';
        }

        $query->orderBy($sortField, $sortDirection);

        $users = $query->paginate(20);

        return response()->json($users);
    }

    /**
     * Ban user trong 1 năm + gửi email
     */
    public function ban(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'banned_until' => now()->addYear(),
            'ban_reason'   => $request->reason,
        ]);

        Mail::to($user->email)->send(new UserBannedMail($user, $request->reason));

        return response()->json(['message' => 'User banned successfully.']);
    }

    /**
     * Gỡ ban user
     */
    public function unban($id)
    {
        $user = User::findOrFail($id);
        $user->update([
            'banned_until' => null,
            'ban_reason'   => null,
        ]);

        return response()->json(['message' => 'User unbanned successfully.']);
    }

    public function approveOrganizer(Request $request, $id)
    {
        $user = User::where('role', 'organizer')->findOrFail($id);

        $request->validate([
            'status' => 'required|in:active,rejected',
        ]);

        $user->update(['status' => $request->status]);

        return response()->json([
            'message' => "Organizer status updated to {$request->status}.",
            'user' => $user,
        ]);
    }
}
