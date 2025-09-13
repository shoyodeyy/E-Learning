<?php

use App\Http\Controllers\Organizer\EventController;
use App\Http\Controllers\Admin\UserAnalyticsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\Student\FavoriteController;
use App\Http\Controllers\Student\ProfileController;
use App\Http\Controllers\Chatbot\ChatController;
use App\Http\Controllers\Feedback\FeedbackController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\Student\PublicEventController;
use App\Services\AIClientWithFallback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



// ===================== PUBLIC ROUTES =====================

Route::get('/public-events', [PublicEventController::class, 'index']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('auth/google/login', [GoogleController::class, 'loginWithGoogle']);

// Events (public view)
Route::get('/events', [EventController::class, 'index']);

// ⚠️ đặt route pending trước route show
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/events/pending', [EventController::class, 'pending']);
});

Route::get('/events/{id}', [EventController::class, 'show']);

// Password reset
Route::post('/user/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/user/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');
Route::post('/user/verify-reset-token', [ResetPasswordController::class, 'verifyToken']);

// Email verification
Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

// AI test route (local only)
if (app()->environment('local')) {
    Route::get('/test-ai-stream', function (Request $request, AIClientWithFallback $ai) {
        $messages = [
            ['role' => 'user', 'content' => $request->query('q', 'Giới thiệu bản thân')]
        ];
        return $ai->stream($messages);
    });
}

// ===================== AUTH ROUTES =====================
Route::middleware('auth:sanctum')->group(function () {
    // User info
    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Email verification
    Route::post('/email/verification-notification', [VerificationController::class, 'send'])
        ->middleware(['throttle:6,1'])
        ->name('verification.send');
    Route::post('/email/resend', [VerificationController::class, 'resend'])
        ->middleware(['throttle:6,1']);
    Route::get('/email/verify-status', [VerificationController::class, 'status']);

    // Profile
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::post('/update', [ProfileController::class, 'update']);
        Route::put('/', [ProfileController::class, 'update']);
    });

    // Events (organizer actions)
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    // Calendar
    Route::get('/events/{id}/calendar', [CalendarController::class, 'getCalendarLinks']);
    Route::get('/events/{id}/calendar/ics', [CalendarController::class, 'downloadICS']);

    // Feedback
    Route::get('/events/{eventId}/feedbacks', [FeedbackController::class, 'index']);
    Route::post('/events/{eventId}/feedbacks', [FeedbackController::class, 'store']);
    Route::put('/feedbacks/{id}', [FeedbackController::class, 'update']);

    // Chatbot
    Route::get('/chat/{sessionId}/history', [ChatController::class, 'history']);
    Route::get('/chat/sessions', [ChatController::class, 'sessions']);
    Route::post('/chat/stream', [ChatController::class, 'stream']);

    // Change password
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{eventId}', [FavoriteController::class, 'destroy']);
});

// ===================== ADMIN ROUTES =====================
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Analytics
    Route::get('/analytics/users/stats', [UserAnalyticsController::class, 'getStats']);
    Route::get('/analytics/users/overview', [UserAnalyticsController::class, 'getOverview']);
    Route::get('/analytics/users/recent', [UserAnalyticsController::class, 'getRecentUsers']);
    Route::get('/analytics/users/hourly', [UserAnalyticsController::class, 'getHourlyStats']);

    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users/{id}/approve', [UserController::class, 'approve']);
    Route::post('/users/{id}/ban', [UserController::class, 'ban']);
    Route::post('/users/{id}/unban', [UserController::class, 'unban']);

    // Organizers
    Route::post('/organizer/{id}/approve', [UserController::class, 'approveOrganizer']);
    Route::get('/organizers', [UserController::class, 'getOrganizers']);

    // Approve / reject events
    Route::post('/events/{id}/approve', [EventController::class, 'approve']);
    Route::post('/events/{id}/reject', [EventController::class, 'reject']);
});

