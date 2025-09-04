<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\UserBannedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 100);
        return User::whereIn('role', ['student', 'instructor'])
            ->orderBy('id')
            ->paginate($perPage, ['*'], 'page', $request->get('page', 1));
    }

    public function ban(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $user = User::findOrFail($id);
        $user->banned_until = now()->addYears(1);
        $user->ban_reason = $request->reason;
        $user->save();

        // Gửi email cho user
        Mail::to($user->email)->send(new UserBannedMail($user, $request->reason));

        return response()->json(['message' => 'User banned successfully.']);
    }

    public function unban($id)
    {
        $user = User::findOrFail($id);
        $user->banned_until = null;
        $user->ban_reason = null;
        $user->save();

        return response()->json(['message' => 'User unbanned successfully.']);
    }
}
