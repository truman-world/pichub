<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController as ApiAuthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\ImageController;
use Illuminate\Support\Facades\Route;

// API Version 1
Route::prefix('v1')->name('api.v1.')->group(function () {
    // Public routes
    Route::post('login', [ApiAuthController::class, 'login'])
        ->name('login')
        ->middleware('throttle:5,1');
        
    Route::post('register', [ApiAuthController::class, 'register'])
        ->name('register')
        ->middleware('throttle:3,1');
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('logout', [ApiAuthController::class, 'logout'])->name('logout');
        Route::get('user', [ApiAuthController::class, 'user'])->name('user');
        
        // User resource
        Route::apiResource('users', UserController::class)
            ->only(['show', 'update'])
            ->middleware('can:update,user');
        
        // Images (will be implemented in Phase 3)
        Route::apiResource('images', ImageController::class);
    });
});
