<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\ResetPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\VerificationController;

//-----------Student----------------------------
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\CourseReviewController;
use App\Http\Controllers\Student\PlatformFeedbackController;
use App\Http\Controllers\Student\SavedVideoController;
use App\Http\Controllers\Student\VideoCommentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('auth/google/login', [GoogleController::class, 'loginWithGoogle']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', static function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Email verification routes for authenticated users
    Route::post('/email/verification-notification', [VerificationController::class, 'send'])
        ->middleware(['throttle:6,1'])
        ->name('verification.send');
    Route::post('/email/resend', [VerificationController::class, 'resend'])
        ->middleware(['throttle:6,1']);
    Route::get('/email/verify-status', [VerificationController::class, 'status']);
});

Route::post('/user/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/user/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');
Route::post('/user/verify-reset-token', [ResetPasswordController::class, 'verifyToken']);

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

/**
 * Student routes
 */
Route::get('/student/courses', [StudentController::class, 'courses']);
Route::post('/student/enroll/{courseId}', [StudentController::class, 'enroll']);
Route::get('/student/my-courses', [StudentController::class, 'myCourses']);

/**
 * Course Reviews
 */
Route::post('/courses/{courseId}/reviews', [CourseReviewController::class, 'store']);
Route::get('/courses/{courseId}/reviews', [CourseReviewController::class, 'index']);

/**
 * Feedback
 */
Route::post('/student/feedback', [PlatformFeedbackController::class, 'store']);
Route::get('/student/feedback', [PlatformFeedbackController::class, 'index']);

/**
 * Saved Videos
 */
Route::post('/videos/{videoId}/save', [SavedVideoController::class, 'store']);
Route::get('/student/saved-videos', [SavedVideoController::class, 'index']);

/**
 * Video Comments
 */
Route::post('/videos/{videoId}/comments', [VideoCommentController::class, 'store']);
Route::get('/videos/{videoId}/comments', [VideoCommentController::class, 'index']);
