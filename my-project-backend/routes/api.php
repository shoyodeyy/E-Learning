<?php

use App\Http\Controllers\Admin\UserAnalyticsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VoucherController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BrowseController;

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('auth/google/login', [GoogleController::class, 'loginWithGoogle']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Email verification
    Route::post('/email/verification-notification', [VerificationController::class, 'send'])
        ->middleware(['throttle:6,1'])
        ->name('verification.send');
    Route::post('/email/resend', [VerificationController::class, 'resend'])
        ->middleware(['throttle:6,1']);
    Route::get('/email/verify-status', [VerificationController::class, 'status']);

    // Change password
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
});

Route::post('/user/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/user/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');
Route::post('/user/verify-reset-token', [ResetPasswordController::class, 'verifyToken']);

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

// ===================== ADMIN ROUTES =====================
Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin')
    ->group(function () {
        // Analytics
        Route::get('/analytics/users/stats', [UserAnalyticsController::class, 'getStats']);
        Route::get('/analytics/users/overview', [UserAnalyticsController::class, 'getOverview']);
        Route::get('/analytics/users/recent', [UserAnalyticsController::class, 'getRecentUsers']);
        Route::get('/analytics/users/hourly', [UserAnalyticsController::class, 'getHourlyStats']);

        // Users
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users/{id}/ban', [UserController::class, 'ban']);
        Route::post('/users/{id}/unban', [UserController::class, 'unban']);

        //Event Approval
        Route::get('/events', [BrowseController::class, 'index']);
        Route::get('/events/{id}', [BrowseController::class, 'show']);
        Route::post('/events/{id}/approve', [BrowseController::class, 'approve']);
        Route::post('/events/{id}/reject', [BrowseController::class, 'reject']);
    });
