<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
        'api_token',
        'storage_used',
        'storage_limit',
        'is_active',
        'last_login_at',
        'last_login_ip',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'api_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'storage_used' => 'integer',
            'storage_limit' => 'integer',
        ];
    }

    /**
     * Get the user's images.
     */
    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }

    /**
     * Get the user's albums.
     */
    public function albums(): HasMany
    {
        return $this->hasMany(Album::class);
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'ADMIN';
    }

    /**
     * Check if user has exceeded storage limit.
     */
    public function hasExceededStorageLimit(): bool
    {
        return $this->storage_used >= $this->storage_limit;
    }

    /**
     * Get remaining storage in bytes.
     */
    public function getRemainingStorage(): int
    {
        return max(0, $this->storage_limit - $this->storage_used);
    }

    /**
     * Get storage usage percentage.
     */
    public function getStorageUsagePercentage(): float
    {
        if ($this->storage_limit === 0) {
            return 0;
        }
        
        return round(($this->storage_used / $this->storage_limit) * 100, 2);
    }
}
