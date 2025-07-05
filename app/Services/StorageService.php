<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\StorageInterface;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StorageService
{
    private array $drivers = [];
    
    /**
     * Get storage driver.
     */
    public function driver(string $driver = null): StorageInterface
    {
        $driver = $driver ?: config('pichub.storage.default', 'local');
        
        if (!isset($this->drivers[$driver])) {
            $this->drivers[$driver] = $this->createDriver($driver);
        }
        
        return $this->drivers[$driver];
    }

    /**
     * Create storage driver instance.
     */
    private function createDriver(string $driver): StorageInterface
    {
        $config = config("pichub.storage.drivers.{$driver}");
        
        if (!$config) {
            throw new \InvalidArgumentException("Storage driver [{$driver}] not configured.");
        }
        
        $class = $config['driver'];
        
        if (!class_exists($class)) {
            throw new \InvalidArgumentException("Storage driver class [{$class}] not found.");
        }
        
        return new $class($config);
    }

    /**
     * Store file.
     */
    public function store(string $path, $contents): bool
    {
        return $this->driver()->store($path, $contents);
    }

    /**
     * Get file URL.
     */
    public function url(string $path): string
    {
        return $this->driver()->url($path);
    }

    /**
     * Delete file.
     */
    public function delete(string $path): bool
    {
        return $this->driver()->delete($path);
    }

    /**
     * Check if file exists.
     */
    public function exists(string $path): bool
    {
        return $this->driver()->exists($path);
    }

    /**
     * Get file size.
     */
    public function size(string $path): int
    {
        return $this->driver()->size($path);
    }

    /**
     * Copy file to backup location.
     */
    public function backup(Image $image): bool
    {
        $backupDriver = config('pichub.storage.backup_driver');
        
        if (!$backupDriver || $backupDriver === config('pichub.storage.default')) {
            return true;
        }
        
        try {
            $contents = $this->driver()->get($image->path);
            return $this->driver($backupDriver)->store($image->path, $contents);
        } catch (\Exception $e) {
            \Log::error('Backup failed', [
                'image_id' => $image->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Refresh CDN cache.
     */
    public function refreshCdn(string $url): bool
    {
        $cdnProvider = config('pichub.cdn.provider');
        
        if (!$cdnProvider) {
            return true;
        }
        
        try {
            // Implement CDN refresh logic based on provider
            switch ($cdnProvider) {
                case 'cloudflare':
                    return $this->refreshCloudflare($url);
                case 'cloudfront':
                    return $this->refreshCloudfront($url);
                default:
                    return true;
            }
        } catch (\Exception $e) {
            \Log::error('CDN refresh failed', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Refresh Cloudflare cache.
     */
    private function refreshCloudflare(string $url): bool
    {
        // Implement Cloudflare API call
        return true;
    }

    /**
     * Refresh CloudFront cache.
     */
    private function refreshCloudfront(string $url): bool
    {
        // Implement CloudFront API call
        return true;
    }

    /**
     * Generate secure URL with expiration.
     */
    public function temporaryUrl(string $path, \DateTimeInterface $expiration): string
    {
        return $this->driver()->temporaryUrl($path, $expiration);
    }

    /**
     * Get storage usage statistics.
     */
    public function getUsageStats(): array
    {
        $totalSize = Image::sum('size');
        $totalFiles = Image::count();
        $diskUsage = $this->driver()->getDiskUsage();
        
        return [
            'total_size' => $totalSize,
            'total_files' => $totalFiles,
            'disk_usage' => $diskUsage,
            'disk_free' => $this->driver()->getDiskFreeSpace(),
        ];
    }
}
