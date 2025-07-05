<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository
{
    /**
     * Create a new user.
     */
    public function create(array $data): User
    {
        return User::create($data);
    }

    /**
     * Update a user.
     */
    public function update(User $user, array $data): User
    {
        $user->update($data);
        
        return $user->fresh();
    }

    /**
     * Find user by ID.
     */
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    /**
     * Find user by email.
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    /**
     * Find user by username.
     */
    public function findByUsername(string $username): ?User
    {
        return User::where('username', $username)->first();
    }

    /**
     * Find user by API token.
     */
    public function findByApiToken(string $token): ?User
    {
        return User::where('api_token', $token)->first();
    }

    /**
     * Update user login information.
     */
    public function updateLoginInfo(User $user, ?string $ip): void
    {
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip,
        ]);
    }

    /**
     * Get active users.
     */
    public function getActiveUsers(int $perPage = 15): LengthAwarePaginator
    {
        return User::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get users by role.
     */
    public function getUsersByRole(string $role): Collection
    {
        return User::where('role', $role)->get();
    }

    /**
     * Search users.
     */
    public function searchUsers(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return User::where(function ($q) use ($query) {
            $q->where('username', 'like', "%{$query}%")
                ->orWhere('email', 'like', "%{$query}%");
        })
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);
    }

    /**
     * Get users with storage usage above limit.
     */
    public function getUsersExceedingStorage(): Collection
    {
        return User::whereRaw('storage_used > storage_limit')->get();
    }

    /**
     * Update user storage usage.
     */
    public function updateStorageUsage(User $user, int $bytes, bool $add = true): void
    {
        $newUsage = $add 
            ? $user->storage_used + $bytes
            : max(0, $user->storage_used - $bytes);
            
        $user->update(['storage_used' => $newUsage]);
    }

    /**
     * Delete a user.
     */
    public function delete(User $user): bool
    {
        return $user->delete();
    }
}
