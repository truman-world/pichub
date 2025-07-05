@extends('layouts.app')

@section('title', __('Register'))

@section('content')
<x-auth-card>
    <x-slot name="logo">
        <a href="{{ route('home') }}" class="flex items-center justify-center">
            <img src="{{ asset('logo.png') }}" alt="{{ config('app.name') }}" class="h-16 w-auto">
        </a>
    </x-slot>
    
    <form method="POST" action="{{ route('auth.register') }}" x-data="{ 
        loading: false, 
        password: '',
        passwordStrength: 0,
        passwordStrengthText: '',
        passwordStrengthColor: '',
        checkPasswordStrength() {
            let strength = 0;
            if (this.password.length >= 8) strength++;
            if (/[a-z]/.test(this.password) && /[A-Z]/.test(this.password)) strength++;
            if (/[0-9]/.test(this.password)) strength++;
            if (/[^A-Za-z0-9]/.test(this.password)) strength++;
            
            this.passwordStrength = strength;
            
            switch(strength) {
                case 0:
                case 1:
                    this.passwordStrengthText = '{{ __('Weak') }}';
                    this.passwordStrengthColor = 'bg-red-500';
                    break;
                case 2:
                    this.passwordStrengthText = '{{ __('Fair') }}';
                    this.passwordStrengthColor = 'bg-yellow-500';
                    break;
                case 3:
                    this.passwordStrengthText = '{{ __('Good') }}';
                    this.passwordStrengthColor = 'bg-blue-500';
                    break;
                case 4:
                    this.passwordStrengthText = '{{ __('Strong') }}';
                    this.passwordStrengthColor = 'bg-green-500';
                    break;
            }
        }
    }" @submit="loading = true">
        @csrf
        
        <div>
            <h2 class="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-6">
                {{ __('Create your account') }}
            </h2>
        </div>
        
        <!-- Username -->
        <div class="relative">
            <input type="text" id="username" name="username" value="{{ old('username') }}" required autofocus
                   pattern="[a-zA-Z0-9_-]+"
                   class="peer w-full h-12 px-3 pt-3 pb-2 text-gray-900 dark:text-gray-100 placeholder-transparent bg-white dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('username') border-red-500 @else border-gray-300 dark:border-gray-600 @enderror"
                   placeholder="{{ __('Username') }}">
            <label for="username" class="absolute left-3 top-2 text-xs text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-xs">
                {{ __('Username') }}
            </label>
            @error('username')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @else
                <p class="mt-1 text-xs text-gray-500">{{ __('Letters, numbers, underscores and hyphens only') }}</p>
            @enderror
        </div>
        
        <!-- Email Address -->
        <div class="relative mt-6">
            <input type="email" id="email" name="email" value="{{ old('email') }}" required
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
                   x-model="password" @input="checkPasswordStrength"
                   class="peer w-full h-12 px-3 pt-3 pb-2 text-gray-900 dark:text-gray-100 placeholder-transparent bg-white dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('password') border-red-500 @else border-gray-300 dark:border-gray-600 @enderror"
                   placeholder="{{ __('Password') }}">
            <label for="password" class="absolute left-3 top-2 text-xs text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-xs">
                {{ __('Password') }}
            </label>
            @error('password')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
            
            <!-- Password Strength Indicator -->
            <div x-show="password.length > 0" class="mt-2">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-gray-500">{{ __('Password strength') }}</span>
                    <span class="text-xs font-medium" :class="{
                        'text-red-600': passwordStrength <= 1,
                        'text-yellow-600': passwordStrength === 2,
                        'text-blue-600': passwordStrength === 3,
                        'text-green-600': passwordStrength === 4
                    }" x-text="passwordStrengthText"></span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div class="h-1.5 rounded-full transition-all duration-300" 
                         :class="passwordStrengthColor"
                         :style="`width: ${passwordStrength * 25}%`"></div>
                </div>
            </div>
        </div>
        
        <!-- Confirm Password -->
        <div class="relative mt-6">
            <input type="password" id="password_confirmation" name="password_confirmation" required
                   class="peer w-full h-12 px-3 pt-3 pb-2 text-gray-900 dark:text-gray-100 placeholder-transparent bg-white dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 dark:border-gray-600"
                   placeholder="{{ __('Confirm Password') }}">
            <label for="password_confirmation" class="absolute left-3 top-2 text-xs text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-xs">
                {{ __('Confirm Password') }}
            </label>
        </div>
        
        <!-- Terms -->
        <div class="mt-6">
            <label for="terms" class="flex items-start">
                <input id="terms" type="checkbox" name="terms" required
                       class="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {{ __('I agree to the') }}
                    <a href="#" class="text-blue-600 hover:text-blue-500">{{ __('Terms of Service') }}</a>
                    {{ __('and') }}
                    <a href="#" class="text-blue-600 hover:text-blue-500">{{ __('Privacy Policy') }}</a>
                </span>
            </label>
            @error('terms')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>
        
        <!-- Submit Button -->
        <div class="mt-6">
            <button type="submit" :disabled="loading" 
                    class="w-full flex justify-center items-center px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg x-show="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span x-text="loading ? '{{ __('Creating account...') }}' : '{{ __('Create account') }}'"></span>
            </button>
        </div>
        
        <!-- Login Link -->
        <div class="mt-6 text-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ __('Already have an account?') }}
                <a href="{{ route('auth.login') }}" class="font-medium text-blue-600 hover:text-blue-500">
                    {{ __('Login') }}
                </a>
            </span>
        </div>
    </form>
</x-auth-card>
@endsection
