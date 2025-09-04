<?php

namespace App\Http\Controllers\Student;

use App\Models\PlatformFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlatformFeedbackController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        return PlatformFeedback::where('user_id', $user->id)->get();
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $feedback = PlatformFeedback::create([
            'user_id' => $user->id,
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'status' => 'pending',
        ]);

        return response()->json($feedback, 201);
    }
}
