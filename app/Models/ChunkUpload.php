<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChunkUpload extends Model
{
    use HasFactory;

    protected $fillable = [
        'upload_id',
        'user_id',
        'filename',
        'file_size',
        'file_type',
        'hash',
        'total_chunks',
        'uploaded_chunks',
        'chunk_data',
        'expires_at',
    ];

    protected $casts = [
        'chunk_data' => 'array',
        'expires_at' => 'datetime',
        'file_size' => 'integer',
        'total_chunks' => 'integer',
        'uploaded_chunks' => 'integer',
    ];

    /**
     * Get the user that owns the chunk upload.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if upload is complete.
     */
    public function isComplete(): bool
    {
        return $this->uploaded_chunks === $this->total_chunks;
    }

    /**
     * Check if upload is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}
