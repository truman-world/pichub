<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

// Apply security headers to all routes
Route::middleware(['web', \App\Http\Middleware\SecurityHeaders::class])->group(function () {
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
        Route::get('/upload', [UploadController::class, 'index'])->name('upload');
        Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery');
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
    
    // Temporary download route
    Route::get('/download/temp/{file}', function ($file) {
        $filename = decrypt($file);
        $path = storage_path('app/temp/' . $filename);
        
        if (!file_exists($path)) {
            abort(404);
        }
        
        return response()->download($path)->deleteFileAfterSend();
    })->name('download.temp')->middleware('signed');
});

// Apply hotlink protection to storage routes
Route::middleware([\App\Http\Middleware\HotlinkProtection::class])->group(function () {
    Route::get('/storage/{path}', function ($path) {
        $fullPath = storage_path('app/public/' . $path);
        
        if (!file_exists($fullPath)) {
            abort(404);
        }
        
        return response()->file($fullPath);
    })->where('path', '.*');
});
