<?php

namespace App\Storage\Drivers;

use App\Contracts\StorageInterface;
use Illuminate\Support\Facades\Storage;

class LocalDriver implements StorageInterface
{
    protected array $config;
    
    public function __construct(array $config)
    {
        $this->config = $config;
    }
    
    public function store(string $path, $contents): bool
    {
        return Storage::disk('public')->put($path, $contents);
    }
    
    public function get(string $path)
    {
        return Storage::disk('public')->get($path);
    }
    
    public function exists(string $path): bool
    {
        return Storage::disk('public')->exists($path);
    }
    
    public function delete(string $path): bool
    {
        return Storage::disk('public')->delete($path);
    }
    
    public function size(string $path): int
    {
        return Storage::disk('public')->size($path);
    }
    
    public function url(string $path): string
    {
        return Storage::disk('public')->url($path);
    }
    
    public function temporaryUrl(string $path, \DateTimeInterface $expiration): string
    {
        return $this->url($path);
    }
}
