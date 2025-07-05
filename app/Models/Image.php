<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Image extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'filename',
        'original_name',
        'path',
        'size',
        'mime_type',
        'width',
        'height',
        'hash',
        'views',
        'is_public',
        'expires_at',
        'metadata',
        'thumbnails',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'expires_at' => 'datetime',
        'metadata' => 'array',
        'thumbnails' => 'array',
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'views' => 'integer',
    ];

    /**
     * Get the user that owns the image.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the albums that contain this image.
     */
    public function albums(): BelongsToMany
    {
        return $this->belongsToMany(Album::class, 'album_images')
            ->withPivot('order')
            ->orderBy('pivot_order');
    }

    /**
     * Get the full URL for the image.
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }

    /**
     * Get the thumbnail URL.
     */
    public function getThumbnailUrlAttribute(): string
    {
        if (isset($this->thumbnails['medium'])) {
            return asset('storage/' . $this->thumbnails['medium']);
        }
        
        return $this->url;
    }

    /**
     * Get human-readable file size.
     */
    public function getHumanSizeAttribute(): string
    {
        $sizes = ['B', 'KB', 'MB', 'GB'];
        $factor = floor((strlen((string) $this->size) - 1) / 3);
        
        return sprintf("%.2f", $this->size / pow(1024, $factor)) . ' ' . $sizes[$factor];
    }

    /**
     * Check if image is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Increment view count.
     */
    public function incrementViews(): void
    {
        $this->increment('views');
    }
}
