<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $key = Str::lower('register:'.$request->ip());

        if (RateLimiter::tooManyAttempts($key, 3)) {
            return response()->json([
                'message' => 'Too many attempts. Please try again in a few minutes.'
            ], 429);
        }

        RateLimiter::hit($key, 600);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:student,instructor',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'student',
        ]);

        // Send email verification
        $user->sendEmailVerificationNotification();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'role', 'email_verified_at']),
            'token' => $token,
            'message' => 'Registration successful! Please check your email to verify your account.',
            'email_verification_required' => true,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $key = Str::lower('login:'.$request->ip());

        if (RateLimiter::tooManyAttempts($key, 10)) {
            return response()->json([
                'message' => 'Too many login attempts. Please try again in 10 minutes.'
            ], 429);
        }

        RateLimiter::hit($key, 600);

        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user is banned
        if ($user->isBanned()) {
            $bannedUntil = $user->banned_until->format('d/m/Y H:i');
            return response()->json([
                'message' => 'Your account has been banned.',
                'error' => 'account_banned',
                'ban_details' => [
                    'reason' => $user->ban_reason,
                    'banned_until' => $bannedUntil,
                ]
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'email_verified_at' => $user->email_verified_at,
                'profile' => $user->profile,
                'google_id' => $user->google_id,
                'is_google_user' => $user->isGoogleUser(),
                'needs_email_verification' => $user->needsEmailVerification(),
            ],
            'token' => $token,
            'email_verified' => $user->hasVerifiedEmail(),
        ], 200);

    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
    public function changePassword(Request $request)
    {
        $user = $request->user();
        $key = Str::lower("change-password:".$user->id);

        // Giới hạn 3 lần trong 1 giờ
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => 'You have changed password too many times. Please try again later.',
            ], 429);
        }

        RateLimiter::hit($key, 3600); // reset sau 1 giờ

        $rules = [
            'new_password' => 'required|string|min:8|confirmed',
        ];

        if ($user->password) {
            $rules['current_password'] = 'required|string';
        }

        $validated = $request->validate($rules);

        if ($user->password && !Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
            'has_password' => true,
        ]);

        return response()->json([
            'message' => $user->wasChanged('password')
                ? 'Password changed successfully!'
                : 'Password not changed.',
        ]);
    }
}
