<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'PicHub')</title>
    <!-- 引入 Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased">
    <div id="app">
        <header class="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <a href="/" class="text-xl font-bold text-slate-800">PicHub</a>
                    </div>
                    <div class="flex items-center">
                        @guest
                            <a href="{{ route('login') }}" class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md">登录</a>
                            <a href="{{ route('register') }}" class="ml-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md">注册</a>
                        @else
                            <span class="text-sm text-slate-600 mr-4">欢迎, {{ Auth::user()->username }}!</span>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="text-sm font-medium text-slate-600 hover:text-slate-800">退出登录</button>
                            </form>
                        @endguest
                    </div>
                </div>
            </nav>
        </header>

        <main class="py-10">
            @yield('content')
        </main>
    </div>
</body>
</html>
