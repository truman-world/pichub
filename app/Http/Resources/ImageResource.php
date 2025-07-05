<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'filename' => $this->filename,
            'original_name' => $this->original_name,
            'url' => $this->url,
            'thumbnail_url' => $this->thumbnail_url,
            'size' => $this->size,
            'human_size' => $this->human_size,
            'mime_type' => $this->mime_type,
            'width' => $this->width,
            'height' => $this->height,
            'dimensions' => "{$this->width}x{$this->height}",
            'views' => $this->views,
            'is_public' => $this->is_public,
            'expires_at' => $this->expires_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
