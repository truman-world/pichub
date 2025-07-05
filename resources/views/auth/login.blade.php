<!-- resources/views/auth/login.blade.php -->
@extends('layouts.app')
@section('title', '登录')
@section('content')
<div class="flex justify-center">
    <div class="w-full max-w-md">
        <form method="POST" action="{{ route('login') }}" class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            @csrf
            <h1 class="text-2xl font-bold text-center mb-6">登录到 PicHub</h1>

            @if ($errors->any())
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            
            <div class="mb-4">
                <label class="block text-slate-700 text-sm font-bold mb-2" for="email">邮箱</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" name="email" value="{{ old('email') }}" required autofocus>
            </div>
            <div class="mb-6">
                <label class="block text-slate-700 text-sm font-bold mb-2" for="password">密码</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" name="password" required>
            </div>
            <div class="flex items-center justify-between">
                <button class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">登录</button>
            </div>
        </form>
    </div>
</div>
@endsection

<!-- resources/views/auth/register.blade.php -->
@extends('layouts.app')
@section('title', '注册')
@section('content')
<div class="flex justify-center">
    <div class="w-full max-w-md">
        <form method="POST" action="{{ route('register') }}" class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            @csrf
            <h1 class="text-2xl font-bold text-center mb-6">创建 PicHub 账户</h1>

            <div class="mb-4">
                <label class="block text-slate-700 text-sm font-bold mb-2" for="username">用户名</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700" id="username" type="text" name="username" value="{{ old('username') }}" required>
            </div>
            <div class="mb-4">
                <label class="block text-slate-700 text-sm font-bold mb-2" for="email">邮箱</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700" id="email" type="email" name="email" value="{{ old('email') }}" required>
            </div>
            <div class="mb-4">
                <label class="block text-slate-700 text-sm font-bold mb-2" for="password">密码</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700" id="password" type="password" name="password" required>
            </div>
            <div class="mb-6">
                <label class="block text-slate-700 text-sm font-bold mb-2" for="password_confirmation">确认密码</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700" id="password_confirmation" type="password" name="password_confirmation" required>
            </div>
            <div class="flex items-center justify-between">
                <button class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded" type="submit">注册</button>
            </div>
        </form>
    </div>
</div>
@endsection
