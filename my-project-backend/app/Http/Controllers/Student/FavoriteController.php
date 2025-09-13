<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'events' => 'required|array',
            'events.*' => 'exists:events,event_id'
        ]);

        $userId = Auth::id();

        foreach ($request->events as $eventId)
        {
            Favorite::firstOrCreate([
                'user_id' => $userId,
                'event_id' => $eventId
            ]);
        }

        return response()->json(['message' => 'Favorites saved successfully']);
    }

    public function index()
    {
        $favorites = Favorite::where('user_id', Auth::id())
            ->with('event')
            ->get();

        return response()->json($favorites);
    }

    public function destroy($eventId)
    {
        Favorite::where('user_id', Auth::id())
            ->where('event_id', $eventId)
            ->delete();

        return response()->json(['message' => 'Favorites deleted successfully']);
    }
}
