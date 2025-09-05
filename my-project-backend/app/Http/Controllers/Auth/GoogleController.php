<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class GoogleController extends Controller
{
    public function loginWithGoogle(Request $request): JsonResponse
    {
        try {
            if (!$request->has('credential')) {
                return response()->json(['status' => 400, 'message' => 'Google credential is required'], 400);
            }

            $idToken = $request->credential;

            $client = new \GuzzleHttp\Client();
            $response = $client->get('https://oauth2.googleapis.com/tokeninfo', [
                'query' => ['id_token' => $idToken]
            ]);

            if ($response->getStatusCode() != 200) {
                throw new \Exception('Invalid ID token');
            }

            $payload = json_decode($response->getBody(), true);

            $clientId = config('services.google.client_id');
            if ($payload['aud'] !== $clientId) {
                throw new \Exception('Token audience mismatch');
            }

            if (!isset($payload['email_verified']) || $payload['email_verified'] !== 'true') {
                throw new \Exception('Email not verified by Google');
            }

            // Auto-verify Google users
            $user = User::updateOrCreate(
                ['email' => $payload['email']],
                [
                    'google_id' => $payload['sub'],
                    'name' => $payload['name'] ?? 'Google User',
                    'email_verified_at' => Carbon::now(), // Auto verify Google accounts
                ]
            );

            // If user already exists but wasn't Google user before, update google_id and verify
            if (!$user->google_id) {
                $user->update([
                    'google_id' => $payload['sub'],
                    'email_verified_at' => Carbon::now(),
                ]);
            }

            $token = $user->createToken('google_token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'google_id' => $user->google_id,
                    'email_verified_at' => $user->email_verified_at,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Google login error: ' . $e->getMessage(), [
                'trace' => $e->getTrace()
            ]);
            return response()->json([
                'status' => 401,
                'message' => 'Google authentication failed: ' . $e->getMessage(),
            ], 401);
        }
    }
}
