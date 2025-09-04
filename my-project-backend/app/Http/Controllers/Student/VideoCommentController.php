<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\VideoComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VideoCommentController extends Controller
{
    // Lấy tất cả comment của 1 video
    public function index($videoId)
    {
        $comments = VideoComment::with('user')
            ->where('video_id', $videoId)
            ->get();

        return response()->json($comments);
    }

    // Student thêm comment
    public function store(Request $request, $videoId)
    {
        $user = Auth::user();

        $comment = VideoComment::create([
            'video_id' => $videoId,
            'user_id' => $user->id,
            'comment_text' => $request->input('comment_text'),
        ]);

        return response()->json($comment, 201);
    }
}
