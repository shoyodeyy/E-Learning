<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ], [
            'email.exists' => 'We could not find a user with that email address.'
        ]);

        $key = Str::lower('forgot-password:' . $request->email);

        if (RateLimiter::tooManyAttempts($key, 1)) {
            return response()->json([
                'status' => 'Too many requests. Please try again later.'
            ], 429);
        }

        RateLimiter::hit($key, 60);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return response()->json(['status' => __($status)], $status === Password::RESET_LINK_SENT ? 200 : 400);
    }
}
