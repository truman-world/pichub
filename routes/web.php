<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// 首页
Route::get('/', function () {
    return view('welcome');
})->name('home');

// 认证路由
Route::get('/login', [AuthController::class, 'showLoginForm'])->middleware('guest')->name('login');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::get('/register', [AuthController::class, 'showRegisterForm'])->middleware('guest')->name('register');
Route::post('/register', [AuthController::class, 'register'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');
