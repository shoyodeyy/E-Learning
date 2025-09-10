<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Schema;

class ResetPasswordController extends Controller
{
    public function verifyToken(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required'
        ]);

        $tableName = Schema::hasTable('password_reset_tokens') ? 'password_reset_tokens' : 'password_resets';

        $tokenRecords = DB::table($tableName)->get();

        $tokenData = null;
        foreach ($tokenRecords as $record) {
            if (Hash::check($request->token, $record->token)) {
                $tokenData = $record;
                break;
            }
        }

        if (!$tokenData) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid or expired token'
            ], 400);
        }

        $createdAt = \Carbon\Carbon::parse($tokenData->created_at);
        if ($createdAt->addHours(24)->isPast()) {
            return response()->json([
                'valid' => false,
                'message' => 'Token has expired'
            ], 400);
        }

        return response()->json([
            'valid' => true,
            'email' => $tokenData->email
        ]);
    }

    public function reset(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            static function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        return response()->json(['status' => __($status)], $status === Password::PASSWORD_RESET ? 200 : 400);
    }
}
