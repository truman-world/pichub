<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Album extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'password',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    protected $hidden = [
        'password',
    ];

    /**
     * Get the user that owns the album.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the images in this album.
     */
    public function images(): BelongsToMany
    {
        return $this->belongsToMany(Image::class, 'album_images')
            ->withPivot('order')
            ->orderBy('pivot_order');
    }

    /**
     * Check if album is password protected.
     */
    public function isPasswordProtected(): bool
    {
        return !is_null($this->password);
    }

    /**
     * Verify album password.
     */
    public function verifyPassword(string $password): bool
    {
        return \Hash::check($password, $this->password);
    }
}
