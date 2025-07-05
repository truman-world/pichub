<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Image;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageService
{
    private ImageManager $imageManager;
    
    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Process uploaded image.
     */
    public function processImage(UploadedFile $file, User $user, array $options = []): Image
    {
        DB::beginTransaction();
        
        try {
            // Generate unique filename
            $filename = $this->generateUniqueFilename($file);
            
            // Process image
            $processedImage = $this->imageManager->read($file->getRealPath());
            
            // Get image info
            $width = $processedImage->width();
            $height = $processedImage->height();
            
            // Apply constraints
            if ($width > config('pichub.image.max_width') || $height > config('pichub.image.max_height')) {
                $processedImage->scale(
                    width: config('pichub.image.max_width'),
                    height: config('pichub.image.max_height')
                );
                $width = $processedImage->width();
                $height = $processedImage->height();
            }
            
            // Save original
            $path = $this->getImagePath($filename);
            $storagePath = Storage::put($path, $processedImage->encode());
            
            // Generate thumbnails
            $thumbnails = $this->generateThumbnails($processedImage, $filename);
            
            // Calculate file hash
            $hash = hash_file('sha256', Storage::path($path));
            
            // Extract metadata
            $exifData = $this->extractExifData($file->getRealPath());
            
            // Create database record
            $image = Image::create([
                'user_id' => $user->id,
                'filename' => $filename,
                'original_name' => $options['name'] ?? $file->getClientOriginalName(),
                'path' => $path,
                'size' => Storage::size($path),
                'mime_type' => $file->getMimeType(),
                'width' => $width,
                'height' => $height,
                'hash' => $hash,
                'metadata' => $exifData,
                'thumbnails' => $thumbnails,
            ]);
            
            // Update user storage
            $user->increment('storage_used', $image->size);
            
            DB::commit();
            
            return $image;
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Clean up any uploaded files
            if (isset($path)) {
                Storage::delete($path);
            }
            
            throw $e;
        }
    }

    /**
     * Generate thumbnails for image.
     */
    public function generateThumbnails($image, string $filename): array
    {
        $thumbnails = [];
        $sizes = config('pichub.image.thumbnail_sizes', [
            'small' => [150, 150],
            'medium' => [300, 300],
            'large' => [600, 600],
        ]);
        
        foreach ($sizes as $name => $dimensions) {
            $thumbnail = clone $image;
            $thumbnail->cover($dimensions[0], $dimensions[1]);
            
            $thumbnailFilename = $this->getThumbnailFilename($filename, $name);
            $thumbnailPath = $this->getThumbnailPath($thumbnailFilename);
            
            Storage::put($thumbnailPath, $thumbnail->encode());
            
            $thumbnails[$name] = $thumbnailPath;
        }
        
        return $thumbnails;
    }

    /**
     * Find image by hash.
     */
    public function findByHash(string $hash, int $userId): ?Image
    {
        return Image::where('hash', $hash)
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * Apply smart compression.
     */
    public function applySmartCompression($image, string $mimeType)
    {
        $quality = config('pichub.image.quality', 85);
        
        // Adjust quality based on image type
        switch ($mimeType) {
            case 'image/jpeg':
                $image->encode('jpg', $quality);
                break;
            case 'image/png':
                // PNG uses compression level 0-9
                $image->encode('png', round($quality / 10));
                break;
            case 'image/webp':
                $image->encode('webp', $quality);
                break;
            case 'image/gif':
                // GIF doesn't support quality
                $image->encode('gif');
                break;
        }
        
        return $image;
    }

    /**
     * Extract EXIF data from image.
     */
    private function extractExifData(string $path): array
    {
        try {
            if (!function_exists('exif_read_data')) {
                return [];
            }
            
            $exif = @exif_read_data($path);
            
            if (!$exif) {
                return [];
            }
            
            // Extract relevant data
            return [
                'make' => $exif['Make'] ?? null,
                'model' => $exif['Model'] ?? null,
                'datetime' => $exif['DateTime'] ?? null,
                'orientation' => $exif['Orientation'] ?? null,
                'gps' => $this->extractGpsData($exif),
            ];
            
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Extract GPS data from EXIF.
     */
    private function extractGpsData(array $exif): ?array
    {
        if (!isset($exif['GPSLatitude']) || !isset($exif['GPSLongitude'])) {
            return null;
        }
        
        $lat = $this->convertGpsCoordinate(
            $exif['GPSLatitude'],
            $exif['GPSLatitudeRef'] ?? 'N'
        );
        
        $lng = $this->convertGpsCoordinate(
            $exif['GPSLongitude'],
            $exif['GPSLongitudeRef'] ?? 'E'
        );
        
        return [
            'latitude' => $lat,
            'longitude' => $lng,
        ];
    }

    /**
     * Convert GPS coordinate to decimal.
     */
    private function convertGpsCoordinate(array $coordinate, string $ref): float
    {
        $degrees = $this->evaluateFraction($coordinate[0]);
        $minutes = $this->evaluateFraction($coordinate[1]);
        $seconds = $this->evaluateFraction($coordinate[2]);
        
        $decimal = $degrees + ($minutes / 60) + ($seconds / 3600);
        
        if ($ref === 'S' || $ref === 'W') {
            $decimal *= -1;
        }
        
        return $decimal;
    }

    /**
     * Evaluate fraction string.
     */
    private function evaluateFraction(string $fraction): float
    {
        $parts = explode('/', $fraction);
        
        if (count($parts) === 2 && $parts[1] != 0) {
            return (float) $parts[0] / (float) $parts[1];
        }
        
        return (float) $fraction;
    }

    /**
     * Generate unique filename.
     */
    private function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->format('YmdHis');
        $random = Str::random(10);
        
        return "{$timestamp}_{$random}.{$extension}";
    }

    /**
     * Get image storage path.
     */
    private function getImagePath(string $filename): string
    {
        $date = now()->format('Y/m/d');
        return "images/{$date}/{$filename}";
    }

    /**
     * Get thumbnail filename.
     */
    private function getThumbnailFilename(string $filename, string $size): string
    {
        $parts = pathinfo($filename);
        return "{$parts['filename']}_{$size}.{$parts['extension']}";
    }

    /**
     * Get thumbnail storage path.
     */
    private function getThumbnailPath(string $filename): string
    {
        $date = now()->format('Y/m/d');
        return "thumbnails/{$date}/{$filename}";
    }
}
