<?php

use App\Http\Controllers\Admin\UserAnalyticsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\BrowseController;
use App\Http\Controllers\Chatbot\ChatController;
use App\Http\Controllers\Feedback\FeedbackController;
use App\Http\Controllers\Organizer\EventController;
use App\Http\Controllers\Student\ProfileController;
use App\Services\AIClientWithFallback;
use App\Http\Controllers\CalendarController;
use Illuminate\Http\Request;
use App\Http\Controllers\Student\EventRegistrationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('auth/google/login', [GoogleController::class, 'loginWithGoogle']);

// Public event routes
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::get('/events/quantity/{quantity}', [EventController::class, 'showWithQuantity']);

// Password reset routes
Route::post('/user/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/user/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');
Route::post('/user/verify-reset-token', [ResetPasswordController::class, 'verifyToken']);

// Email verification link
Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

// AI test route (local environment only)
if (app()->environment('local')) {
    Route::get('/test-ai-stream', function (Request $request, AIClientWithFallback $ai) {
        $messages = [
            ['role' => 'user', 'content' => $request->query('q', 'Giới thiệu bản thân')]
        ];
        return $ai->stream($messages);
    });
}

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Email verification routes
    Route::post('/email/verification-notification', [VerificationController::class, 'send'])
        ->middleware(['throttle:6,1'])
        ->name('verification.send');
    Route::post('/email/resend', [VerificationController::class, 'resend'])
        ->middleware(['throttle:6,1']);
    Route::get('/email/verify-status', [VerificationController::class, 'status']);

    // Profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::post('/update', [ProfileController::class, 'update']);
        Route::put('/', [ProfileController::class, 'update']);
    });

    // Event routes
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    // Chatbot routes
    Route::get('/chat/{sessionId}/history', [ChatController::class, 'history']);
    Route::get('/chat/sessions', [ChatController::class, 'sessions']);
    Route::post('/chat/stream', [ChatController::class, 'stream']);

    // Change password
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);

    // Calendar routes
    Route::get('/events/{id}/calendar', [CalendarController::class, 'getCalendarLinks']);
    Route::get('/events/{id}/calendar/ics', [CalendarController::class, 'downloadICS']);

    // registration routes
    Route::post('/events/{eventId}/register', [EventRegistrationController::class, 'register']);
    Route::post('/events/{eventId}/cancel', [EventRegistrationController::class, 'cancel']);
    Route::get('/events/{eventId}/registration/status', [EventRegistrationController::class, 'status']);
    Route::get('/user/registrations', [EventRegistrationController::class, 'myRegistrations']);
    Route::get('/events/{eventId}/seats', [EventRegistrationController::class, 'seats']);
    Route::get('/events/{id}/available-seats', [EventRegistrationController::class, 'availableSeats']);

});
//Organizer routes
Route::middleware(['auth:sanctum', 'role:organizer'])->group(function () {
    Route::get('/events/{eventId}/registrations', [EventRegistrationController::class, 'listByEvent']);
    Route::post('/registrations/{id}/attendance', [EventRegistrationController::class, 'markAttendance']);

    // Feedback routes - UPDATED WITH NEW LOGIC
    Route::get('/events/{eventId}/feedbacks', [FeedbackController::class, 'index']);
    Route::post('/events/{eventId}/feedbacks', [FeedbackController::class, 'store']);
    Route::put('/feedbacks/{id}', [FeedbackController::class, 'update']);
});

// ===================== ADMIN ROUTES =====================

// Admin routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Analytics
    Route::get('/analytics/users/stats', [UserAnalyticsController::class, 'getStats']);
    Route::get('/analytics/users/overview', [UserAnalyticsController::class, 'getOverview']);
    Route::get('/analytics/users/recent', [UserAnalyticsController::class, 'getRecentUsers']);
    Route::get('/analytics/users/hourly', [UserAnalyticsController::class, 'getHourlyStats']);

    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users/{id}/ban', [UserController::class, 'ban']);
    Route::post('/users/{id}/unban', [UserController::class, 'unban']);
    Route::post('/organizer/{id}/approve', [UserController::class, 'approveOrganizer']);
    Route::get('/organizers', [UserController::class, 'getOrganizers']);
});