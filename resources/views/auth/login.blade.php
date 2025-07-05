<!-- resources/views/auth/login.blade.php -->
@extends('layouts.app')
@section('title', '登录')
@section('content')
<div class="flex justify-center">
    <div class="w-full max-w-md">
        <form method="POST" action="{{ route('login') }}" class="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
            @csrf
            <h1 class="text-2xl font-bold text-center mb-6">登录到 PicHub</h1>
            @if(session('success'))<p class="text-green-500 text-center mb-4">{{ session('success') }}</p>@endif
            @error('email')<p class="text-red-500 text-xs italic text-center mb-4">{{ $message }}</p>@enderror
            
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">邮箱</label>
                <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" type="email" name="email" value="{{ old('email') }}" required autofocus>
            </div>
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">密码</label>
                <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" type="password" name="password" required>
            </div>
            <div class="flex items-center justify-between">
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline" type="submit">登录</button>
            </div>
        </form>
    </div>
</div>
@endsection
