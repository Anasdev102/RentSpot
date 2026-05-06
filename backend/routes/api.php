<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Api\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Api\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Api\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\Admin\SportController as AdminSportController;
use App\Http\Controllers\Api\Admin\StadiumController as AdminStadiumController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SportController;
use App\Http\Controllers\Api\StadiumController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::get('google/redirect', [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback', [AuthController::class, 'handleGoogleCallback']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::get('sports', [SportController::class, 'index']);
Route::get('stadium-cities', [StadiumController::class, 'cities']);
Route::get('stadiums', [StadiumController::class, 'index']);
Route::get('stadiums/{stadium}', [StadiumController::class, 'show']);
Route::post('contact', [ContactController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::patch('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::patch('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::get('favorites', [FavoriteController::class, 'index']);
    Route::post('favorites/{stadium}', [FavoriteController::class, 'store']);
    Route::delete('favorites/{stadium}', [FavoriteController::class, 'destroy']);
    Route::get('reservations', [ReservationController::class, 'index']);
    Route::post('reservations', [ReservationController::class, 'store']);
    Route::patch('reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);
    Route::post('reservations/{reservation}/pay', [PaymentController::class, 'pay']);
    Route::post('reservations/{reservation}/paypal/order', [PaymentController::class, 'createPaypalOrder']);
    Route::post('reservations/{reservation}/paypal/capture', [PaymentController::class, 'capturePaypalOrder']);
    Route::post('reviews', [ReviewController::class, 'store']);
});

Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('dashboard', DashboardController::class);
    Route::get('notifications', [AdminNotificationController::class, 'index']);
    Route::patch('notifications/read-all', [AdminNotificationController::class, 'markAllAsRead']);
    Route::patch('notifications/{id}/read', [AdminNotificationController::class, 'markAsRead']);
    Route::apiResource('sports', AdminSportController::class);
    Route::apiResource('stadiums', AdminStadiumController::class);
    Route::apiResource('reservations', AdminReservationController::class)->except(['store']);
    Route::apiResource('payments', AdminPaymentController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::apiResource('users', AdminUserController::class);
    Route::apiResource('reviews', AdminReviewController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::get('contact-messages', [AdminContactMessageController::class, 'index']);
    Route::get('contact-messages/{contactMessage}', [AdminContactMessageController::class, 'show']);
    Route::patch('contact-messages/{contactMessage}/read', [AdminContactMessageController::class, 'markAsRead']);
    Route::patch('contact-messages/{contactMessage}/replied', [AdminContactMessageController::class, 'markAsReplied']);
    Route::post('contact-messages/{contactMessage}/reply', [AdminContactMessageController::class, 'reply']);
    Route::delete('contact-messages/{contactMessage}', [AdminContactMessageController::class, 'destroy']);
});
