<?php


use App\Http\Controllers\Admin\UserAnalyticsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VoucherController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\ResetPasswordController;

use App\Http\Controllers\Chatbot\ChatController;
use App\Services\AIClientWithFallback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\VerificationController;


//use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('auth/google/login', [GoogleController::class, 'loginWithGoogle']);

if (app()->environment('local')) {
    Route::get('/test-ai-stream', function (Request $request, AIClientWithFallback $ai) {
        $messages = [
            ['role' => 'user', 'content' => $request->query('q', 'Giới thiệu bản thân')]
        ];
        return $ai->stream($messages);
    });
}


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', static function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

//    Route::apiResource('users', UserController::class);
    // Email verification routes for authenticated users
    Route::post('/email/verification-notification', [VerificationController::class, 'send'])
        ->middleware(['throttle:6,1'])
        ->name('verification.send');
    Route::post('/email/resend', [VerificationController::class, 'resend'])
        ->middleware(['throttle:6,1']);
    Route::get('/email/verify-status', [VerificationController::class, 'status']);


    //Chatbot routes
    Route::get('/chat/{sessionId}/history', [ChatController::class, 'history']);
    Route::get('/chat/sessions', [ChatController::class, 'sessions']);
    Route::post('/chat/stream', [ChatController::class, 'stream']);
    // Change password
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
});

Route::post('/user/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/user/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');
Route::post('/user/verify-reset-token', [ResetPasswordController::class, 'verifyToken']);

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

//Admin routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
//    Analytic
    Route::get('/analytics/users/stats', [UserAnalyticsController::class, 'getStats']);
    Route::get('/analytics/users/overview', [UserAnalyticsController::class, 'getOverview']);
    Route::get('/analytics/users/recent', [UserAnalyticsController::class, 'getRecentUsers']);
    Route::get('/analytics/users/hourly', [UserAnalyticsController::class, 'getHourlyStats']);

//    Vouchers
    Route::post('/vouchers', [VoucherController::class, 'store']);
    Route::put('/vouchers/{id}', [VoucherController::class, 'update']);
    Route::delete('/vouchers/{id}', [VoucherController::class, 'destroy']);
    Route::get('/vouchers', [VoucherController::class, 'index']);
    Route::get('/vouchers/{id}', [VoucherController::class, 'show']);

//    Users
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users/{id}/ban', [UserController::class, 'ban']);
    Route::post('/users/{id}/unban', [UserController::class, 'unban']);
});

