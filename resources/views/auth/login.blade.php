@extends('layouts.app')

@section('title', __('Login'))

@section('content')
<x-auth-card>
    <x-slot name="logo">
        <a href="{{ route('home') }}" class="flex items-center justify-center">
            <img src="{{ asset('logo.png') }}" alt="{{ config('app.name') }}" class="h-16 w-auto">
        </a>
    </x-slot>
    
    <form method="POST" action="{{ route('auth.login') }}" x-data="{ loading: false }" @submit="loading = true">
        @csrf
        
        <div>
            <h2 class="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-6">
                {{ __('Welcome back') }}
            </h2>
        </div>
        
        <!-- Session Status -->
        @if (session('status'))
            <div class="mb-4 text-sm font-medium text-green-600">
                {{ session('status') }}
            </div>
        @endif
        
        <!-- Email Address -->
        <div class="relative">
            <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus
                   class="peer w-full h-12 px-3 pt-3 pb-2 text-gray-900 dark:text-gray-100 placeholder-transparent bg-white dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('email') border-red-500 @else border-gray-300 dark:border-gray-600 @enderror"
                   placeholder="{{ __('Email') }}">
            <label for="email" class="absolute left-3 top-2 text-xs text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-xs">
                {{ __('Email') }}
            </label>
            @error('email')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>
        
        <!-- Password -->
        <div class="relative mt-6">
            <input type="password" id="password" name="password" required
                   class="peer w-full h-12 px-3 pt-3 pb-2 text-gray-900 dark:text-gray-100 placeholder-transparent bg-white dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('password') border-red-500 @else border-gray-300 dark:border-gray-600 @enderror"
                   placeholder="{{ __('Password') }}">
            <label for="password" class="absolute left-3 top-2 text-xs text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-xs">
                {{ __('Password') }}
            </label>
            @error('password')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>
        
        <!-- Remember Me -->
        <div class="flex items-center justify-between mt-6">
            <label for="remember" class="flex items-center">
                <input id="remember" type="checkbox" name="remember" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ __('Remember me') }}</span>
            </label>
            
            <a href="{{ route('auth.password.request') }}" class="text-sm text-blue-600 hover:text-blue-500">
                {{ __('Forgot password?') }}
            </a>
        </div>
        
        <!-- Submit Button -->
        <div class="mt-6">
            <button type="submit" :disabled="loading" 
                    class="w-full flex justify-center items-center px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg x-show="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span x-text="loading ? '{{ __('Logging in...') }}' : '{{ __('Login') }}'"></span>
            </button>
        </div>
        
        <!-- Social Login Placeholder -->
        <div class="mt-6">
            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">{{ __('Or continue with') }}</span>
                </div>
            </div>
            
            <div class="mt-6 grid grid-cols-2 gap-3">
                <button type="button" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.02 10.02 0 0020 10c0-5.523-4.477-10-10-10z"/>
                    </svg>
                </button>
                
                <button type="button" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                </button>
            </div>
        </div>
        
        <!-- Register Link -->
        <div class="mt-6 text-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ __("Don't have an account?") }}
                <a href="{{ route('auth.register') }}" class="font-medium text-blue-600 hover:text-blue-500">
                    {{ __('Register now') }}
                </a>
            </span>
        </div>
    </form>
</x-auth-card>
@endsection
