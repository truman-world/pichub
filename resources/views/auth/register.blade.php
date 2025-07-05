<!-- resources/views/auth/register.blade.php -->
@extends('layouts.app')
@section('title', '注册')
@section('content')
<div class="flex justify-center">
    <div class="w-full max-w-md">
        <form method="POST" action="{{ route('register') }}" class="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
            @csrf
            <h1 class="text-2xl font-bold text-center mb-6">创建 PicHub 账户</h1>
            @if($errors->any())<div class="text-red-500 text-xs italic mb-4"><ul>@foreach($errors->all() as $error)<li>{{ $error }}</li>@endforeach</ul></div>@endif

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">用户名</label>
                <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700" id="username" type="text" name="username" value="{{ old('username') }}" required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">邮箱</label>
                <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700" id="email" type="email" name="email" value="{{ old('email') }}" required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">密码 (至少8位)</label>
                <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700" id="password" type="password" name="password" required>
            </div>
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="password_confirmation">确认密码</label>
                <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700" id="password_confirmation" type="password" name="password_confirmation" required>
            </div>
            <div class="flex items-center justify-between">
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" type="submit">注册</button>
            </div>
        </form>
    </div>
</div>
@endsection
