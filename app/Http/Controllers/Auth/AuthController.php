<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\AuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    /**
     * Show the login form.
     */
    public function showLoginForm(): View
    {
        return view('auth.login');
    }

    /**
     * Handle login request.
     */
    public function login(LoginRequest $request): RedirectResponse
    {
        try {
            $credentials = $request->validated();
            $remember = $request->boolean('remember');
            
            $result = $this->authService->login(
                $credentials,
                $remember,
                $request->ip()
            );

            if (!$result['success']) {
                return back()
                    ->withErrors(['email' => $result['message']])
                    ->withInput($request->only('email'));
            }

            $request->session()->regenerate();
            
            return redirect()
                ->intended(route('dashboard'))
                ->with('success', __('auth.login_success'));
                
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage(), [
                'email' => $request->input('email'),
                'ip' => $request->ip(),
            ]);
            
            return back()
                ->withErrors(['email' => __('auth.login_error')])
                ->withInput($request->only('email'));
        }
    }

    /**
     * Show the registration form.
     */
    public function showRegisterForm(): View
    {
        return view('auth.register');
    }

    /**
     * Handle registration request.
     */
    public function register(RegisterRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            
            $user = $this->authService->register($data, $request->ip());
            
            auth()->login($user);
            
            return redirect()
                ->route('dashboard')
                ->with('success', __('auth.register_success'));
                
        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage(), [
                'email' => $request->input('email'),
                'ip' => $request->ip(),
            ]);
            
            return back()
                ->withErrors(['email' => __('auth.register_error')])
                ->withInput($request->except('password'));
        }
    }

    /**
     * Handle logout request.
     */
    public function logout(Request $request): RedirectResponse
    {
        $this->authService->logout(auth()->user());
        
        auth()->logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()
            ->route('home')
            ->with('success', __('auth.logout_success'));
    }

    /**
     * Show forgot password form.
     */
    public function showForgotPasswordForm(): View
    {
        return view('auth.forgot-password');
    }

    /**
     * Handle forgot password request.
     */
    public function forgotPassword(ForgotPasswordRequest $request): RedirectResponse
    {
        try {
            $result = $this->authService->sendPasswordResetLink(
                $request->input('email')
            );
            
            if (!$result['success']) {
                return back()
                    ->withErrors(['email' => $result['message']])
                    ->withInput();
            }
            
            return back()->with('status', __('auth.reset_link_sent'));
            
        } catch (\Exception $e) {
            Log::error('Forgot password error: ' . $e->getMessage(), [
                'email' => $request->input('email'),
            ]);
            
            return back()
                ->withErrors(['email' => __('auth.reset_link_error')])
                ->withInput();
        }
    }

    /**
     * Show reset password form.
     */
    public function showResetPasswordForm(Request $request, string $token): View
    {
        return view('auth.reset-password', [
            'token' => $token,
            'email' => $request->input('email'),
        ]);
    }

    /**
     * Handle reset password request.
     */
    public function resetPassword(ResetPasswordRequest $request): RedirectResponse
    {
        try {
            $result = $this->authService->resetPassword(
                $request->only('email', 'password', 'token')
            );
            
            if (!$result['success']) {
                return back()
                    ->withErrors(['email' => $result['message']])
                    ->withInput($request->only('email'));
            }
            
            return redirect()
                ->route('auth.login')
                ->with('status', __('auth.password_reset_success'));
                
        } catch (\Exception $e) {
            Log::error('Reset password error: ' . $e->getMessage());
            
            return back()
                ->withErrors(['email' => __('auth.password_reset_error')])
                ->withInput($request->only('email'));
        }
    }
}
