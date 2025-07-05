<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Authentication routes
Route::prefix('auth')->name('auth.')->group(function () {
    // Guest only routes
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
        Route::post('login', [AuthController::class, 'login'])
            ->middleware('throttle:5,1');
        
        Route::get('register', [AuthController::class, 'showRegisterForm'])->name('register');
        Route::post('register', [AuthController::class, 'register'])
            ->middleware('throttle:3,1');
        
        Route::get('forgot-password', [AuthController::class, 'showForgotPasswordForm'])
            ->name('password.request');
        Route::post('forgot-password', [AuthController::class, 'forgotPassword'])
            ->name('password.email')
            ->middleware('throttle:3,1');
        
        Route::get('reset-password/{token}', [AuthController::class, 'showResetPasswordForm'])
            ->name('password.reset');
        Route::post('reset-password', [AuthController::class, 'resetPassword'])
            ->name('password.update')
            ->middleware('throttle:3,1');
    });
    
    // Authenticated only routes
    Route::middleware('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
    });
});

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Additional authenticated routes will be added in Phase 3
});

// Email verification routes
Route::middleware('auth')->prefix('email')->name('verification.')->group(function () {
    Route::get('verify', fn () => view('auth.verify-email'))->name('notice');
    
    Route::get('verify/{id}/{hash}', function ($id, $hash) {
        // Email verification logic
    })->middleware(['signed'])->name('verify');
    
    Route::post('verification-notification', function () {
        // Resend verification email
    })->middleware('throttle:6,1')->name('send');
});
