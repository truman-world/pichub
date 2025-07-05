<?php

declare(strict_types=1);

namespace App\Services;

use App\Jobs\SendWelcomeEmail;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthService
{
    private const MAX_LOGIN_ATTEMPTS = 5;
    private const LOCKOUT_DURATION = 900; // 15 minutes in seconds

    public function __construct(
        private readonly UserRepository $userRepository
    ) {}

    /**
     * Handle user login.
     */
    public function login(array $credentials, bool $remember, ?string $ip): array
    {
        $email = $credentials['email'];
        
        // Check if user is locked out
        if ($this->isLockedOut($email)) {
            return [
                'success' => false,
                'message' => __('auth.throttle', [
                    'seconds' => $this->getRemainingLockoutTime($email)
                ]),
            ];
        }
        
        // Attempt login
        if (!auth()->attempt($credentials, $remember)) {
            $this->incrementLoginAttempts($email);
            
            return [
                'success' => false,
                'message' => __('auth.failed'),
            ];
        }
        
        // Clear login attempts
        $this->clearLoginAttempts($email);
        
        // Update user login info
        $user = auth()->user();
        $this->userRepository->updateLoginInfo($user, $ip);
        
        // Log successful login
        Log::info('User logged in', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $ip,
        ]);
        
        return [
            'success' => true,
            'user' => $user,
        ];
    }

    /**
     * Register a new user.
     */
    public function register(array $data, ?string $ip): User
    {
        DB::beginTransaction();
        
        try {
            // Create user
            $user = $this->userRepository->create([
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'api_token' => $this->generateApiToken(),
                'last_login_at' => now(),
            ]);
            
            // Send welcome email
            SendWelcomeEmail::dispatch($user)->onQueue('emails');
            
            // Log registration
            Log::info('New user registered', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $ip,
            ]);
            
            DB::commit();
            
            return $user;
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Handle user logout.
     */
    public function logout(User $user): void
    {
        // Regenerate API token for security
        $this->userRepository->update($user, [
            'api_token' => $this->generateApiToken(),
        ]);
        
        Log::info('User logged out', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);
    }

    /**
     * Send password reset link.
     */
    public function sendPasswordResetLink(string $email): array
    {
        $status = Password::sendResetLink(['email' => $email]);
        
        if ($status === Password::RESET_LINK_SENT) {
            Log::info('Password reset link sent', ['email' => $email]);
            
            return [
                'success' => true,
                'message' => __($status),
            ];
        }
        
        return [
            'success' => false,
            'message' => __($status),
        ];
    }

    /**
     * Reset user password.
     */
    public function resetPassword(array $data): array
    {
        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'api_token' => $this->generateApiToken(),
                ])->setRememberToken(Str::random(60));
                
                $user->save();
                
                event(new PasswordReset($user));
                
                Log::info('Password reset successful', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                ]);
            }
        );
        
        if ($status === Password::PASSWORD_RESET) {
            return [
                'success' => true,
                'message' => __($status),
            ];
        }
        
        return [
            'success' => false,
            'message' => __($status),
        ];
    }

    /**
     * Generate API token.
     */
    public function generateApiToken(): string
    {
        return Str::random(80);
    }

    /**
     * Check if user is locked out.
     */
    private function isLockedOut(string $email): bool
    {
        $attempts = $this->getLoginAttempts($email);
        
        return $attempts >= self::MAX_LOGIN_ATTEMPTS;
    }

    /**
     * Get login attempts for email.
     */
    private function getLoginAttempts(string $email): int
    {
        return (int) Cache::get($this->getLoginAttemptsKey($email), 0);
    }

    /**
     * Increment login attempts.
     */
    private function incrementLoginAttempts(string $email): void
    {
        $key = $this->getLoginAttemptsKey($email);
        $attempts = $this->getLoginAttempts($email) + 1;
        
        Cache::put($key, $attempts, self::LOCKOUT_DURATION);
    }

    /**
     * Clear login attempts.
     */
    private function clearLoginAttempts(string $email): void
    {
        Cache::forget($this->getLoginAttemptsKey($email));
    }

    /**
     * Get remaining lockout time.
     */
    private function getRemainingLockoutTime(string $email): int
    {
        $key = $this->getLoginAttemptsKey($email);
        $ttl = Cache::store()->getStore()->get($key);
        
        return $ttl ? (int) ceil($ttl / 60) : 0;
    }

    /**
     * Get login attempts cache key.
     */
    private function getLoginAttemptsKey(string $email): string
    {
        return 'login_attempts:' . Str::lower($email);
    }
}
