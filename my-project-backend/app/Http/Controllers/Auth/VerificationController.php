<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use App\Models\User;

class VerificationController extends Controller
{
    /**
     * Generate frontend URL with proper formatting
     */
    private function getFrontendUrl($path = '')
    {
        $baseUrl = rtrim(config('app.frontend_url'), '/');
        $path = ltrim($path, '/');

        return $baseUrl . ($path ? '/' . $path : '');
    }

    /**
     * Get dashboard URL based on user role
     */
    private function getDashboardByRole($user, $message = null)
    {
        $dashboardUrl = match($user->role) {
            'admin' => 'admin/dashboard',
            'organizer' => 'organizer/dashboard',
            default => 'dashboard'
        };

        if ($message) {
            $dashboardUrl .= '?message=' . $message;
        }

        return $this->getFrontendUrl($dashboardUrl);
    }

    /**
     * Send email verification notification
     */
    public function send(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified.'
            ], 422);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification email sent successfully.'
        ]);
    }

    /**
     * Verify email from the verification link
     */
    public function verify(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        // Check if the hash matches
        if (!hash_equals(
            (string) $request->route('hash'),
            sha1($user->getEmailForVerification())
        )) {
            return redirect($this->getFrontendUrl('email-verification-result?error=invalid_link'));
        }

        // Check if the URL signature is valid
        if (!$request->hasValidSignature()) {
            return redirect($this->getFrontendUrl('email-verification-result?error=expired_link'));
        }

        if ($user->hasVerifiedEmail()) {
            return redirect($this->getDashboardByRole($user, 'already_verified'));
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Redirect to appropriate dashboard based on role
        return redirect($this->getDashboardByRole($user, 'email_verified'));
    }

    /**
     * Resend verification email
     */
    public function resend(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified.'
            ], 422);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification email sent successfully.'
        ]);
    }

    /**
     * Check verification status
     */
    public function status(Request $request): JsonResponse
    {
        return response()->json([
            'verified' => $request->user()->hasVerifiedEmail(),
            'email_verified_at' => $request->user()->email_verified_at,
            'email' => $request->user()->email,
            'role' => $request->user()->role,
        ]);
    }
}
