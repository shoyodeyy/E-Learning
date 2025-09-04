<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\SavedVideo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SavedVideoController extends Controller
{
    // Lấy danh sách video đã lưu
    public function index()
    {
        $user = Auth::user();
        $videos = SavedVideo::with('video')
            ->where('user_id', $user->id)
            ->get();

        return response()->json($videos);
    }

    // Lưu video
    public function store($videoId)
    {
        $user = Auth::user();

        $exists = SavedVideo::where('user_id', $user->id)
            ->where('video_id', $videoId)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Video này đã được lưu trước đó.']);
        }

        $saved = SavedVideo::create([
            'user_id' => $user->id,
            'video_id' => $videoId,
        ]);

        return response()->json($saved, 201);
    }
}
