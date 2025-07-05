<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// 首页
Route::get('/', function () {
    return view('welcome');
});

// 认证相关的路由
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// 需要登录才能访问的路由组
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function() {
        // 普通用户仪表盘
        return '欢迎来到您的仪表盘！';
    });

    // 需要管理员权限才能访问的路由组
    Route::middleware('can:access-admin')->group(function() {
        Route::get('/admin/dashboard', function() {
            return '欢迎来到管理员后台！';
        });
    });
});
