mkdir -p resources/views
cat > resources/views/welcome.blade.php << 'EOF'
@extends('layouts.app')

@section('content')
<div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to {{ config('app.name') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Your enterprise-grade image hosting solution
        </p>
        @guest
            <div class="space-x-4">
                <a href="{{ route('auth.login') }}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Login
                </a>
                <a href="{{ route('auth.register') }}" class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Register
                </a>
            </div>
        @else
            <a href="{{ route('dashboard') }}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Go to Dashboard
            </a>
        @endguest
    </div>
</div>
@endsection
EOF
