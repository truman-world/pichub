<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'PicHub')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'LXGW WenKai TC', sans-serif; }
    </style>
</head>
<body class="bg-gray-50 text-gray-800 antialiased">
    <div id="app">
        <header class="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <a href="{{ route('home') }}" class="text-2xl font-bold text-gray-900">PicHub</a>
                    </div>
                    <div class="flex items-center">
                        @guest
                            <a href="{{ route('login') }}" class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">登录</a>
                            <a href="{{ route('register') }}" class="ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">注册</a>
                        @else
                            <span class="text-sm text-gray-600 mr-4">欢迎, {{ Auth::user()->username }}!</span>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="text-sm font-medium text-gray-600 hover:text-gray-800">退出登录</button>
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
