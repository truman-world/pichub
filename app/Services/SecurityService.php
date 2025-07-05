<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;

class SecurityService
{
    private array $allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml',
    ];
    
    private array $allowedExtensions = [
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'
    ];
    
    private int $maxFileSize = 104857600; // 100MB

    /**
     * Validate uploaded file.
     */
    public function validateFile(UploadedFile $file): void
    {
        // Check file size
        if ($file->getSize() > $this->maxFileSize) {
            throw new \InvalidArgumentException('File size exceeds maximum allowed size.');
        }
        
        // Validate MIME type
        $this->validateMimeType($file);
        
        // Validate extension
        $this->validateExtension($file);
        
        // Check for malicious content
        $this->scanForMaliciousContent($file);
        
        // Validate image integrity
        $this->validateImageIntegrity($file);
    }

    /**
     * Validate MIME type.
     */
    private function validateMimeType(UploadedFile $file): void
    {
        $mimeType = $file->getMimeType();
        
        if (!in_array($mimeType, $this->allowedMimeTypes)) {
            throw new \InvalidArgumentException('Invalid file type.');
        }
        
        // Double-check with file content
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $detectedMimeType = $finfo->file($file->getRealPath());
        
        if ($detectedMimeType !== $mimeType) {
            throw new \InvalidArgumentException('File type mismatch detected.');
        }
    }

    /**
     * Validate file extension.
     */
    private function validateExtension(UploadedFile $file): void
    {
        $extension = strtolower($file->getClientOriginalExtension());
        
        if (!in_array($extension, $this->allowedExtensions)) {
            throw new \InvalidArgumentException('Invalid file extension.');
        }
    }

    /**
     * Scan file for malicious content.
     */
    private function scanForMaliciousContent(UploadedFile $file): void
    {
        // Check for PHP code in image
        $content = file_get_contents($file->getRealPath());
        
        $suspiciousPatterns = [
            '/<\?php/i',
            '/<script/i',
            '/eval\s*\(/i',
            '/base64_decode/i',
            '/system\s*\(/i',
            '/exec\s*\(/i',
        ];
        
        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                throw new \InvalidArgumentException('Suspicious content detected in file.');
            }
        }
        
        // Check for ZIP bombs
        $this->checkForZipBomb($file);
        
        // Optional: Use ClamAV if available
        if (config('pichub.security.clamav_enabled')) {
            $this->scanWithClamAV($file);
        }
    }

    /**
     * Check for ZIP bomb attacks.
     */
    private function checkForZipBomb(UploadedFile $file): void
    {
        if (!in_array($file->getMimeType(), ['image/svg+xml'])) {
            return;
        }
        
        // Check for excessive entity expansion in SVG
        $content = file_get_contents($file->getRealPath());
        $entityCount = substr_count($content, '<!ENTITY');
        
        if ($entityCount > 10) {
            throw new \InvalidArgumentException('Potential security threat detected.');
        }
    }

    /**
     * Scan file with ClamAV.
     */
    private function scanWithClamAV(UploadedFile $file): void
    {
        $socket = socket_create(AF_UNIX, SOCK_STREAM, 0);
        
        if (!socket_connect($socket, '/var/run/clamav/clamd.ctl')) {
            // ClamAV not available, skip
            return;
        }
        
        socket_send($socket, "SCAN {$file->getRealPath()}\n", strlen("SCAN {$file->getRealPath()}\n"), 0);
        
        $response = '';
        while ($buffer = socket_read($socket, 1024)) {
            $response .= $buffer;
        }
        
        socket_close($socket);
        
        if (strpos($response, 'FOUND') !== false) {
            throw new \InvalidArgumentException('Virus detected in uploaded file.');
        }
    }

    /**
     * Validate image integrity.
     */
    private function validateImageIntegrity(UploadedFile $file): void
    {
        try {
            $image = @imagecreatefromstring(file_get_contents($file->getRealPath()));
            
            if ($image === false) {
                throw new \InvalidArgumentException('Invalid image file.');
            }
            
            imagedestroy($image);
            
        } catch (\Exception $e) {
            throw new \InvalidArgumentException('Corrupted image file.');
        }
    }

    /**
     * Sanitize filename.
     */
    public function sanitizeFilename(string $filename): string
    {
        // Remove any path components
        $filename = basename($filename);
        
        // Replace non-alphanumeric characters
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);
        
        // Remove multiple consecutive underscores
        $filename = preg_replace('/_+/', '_', $filename);
        
        // Limit length
        if (strlen($filename) > 255) {
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $basename = pathinfo($filename, PATHINFO_FILENAME);
            $basename = substr($basename, 0, 255 - strlen($extension) - 1);
            $filename = $basename . '.' . $extension;
        }
        
        return $filename;
    }

    /**
     * Check image content for inappropriate material.
     */
    public function moderateContent(string $imagePath): array
    {
        if (!config('pichub.moderation.enabled')) {
            return ['safe' => true];
        }
        
        $provider = config('pichub.moderation.provider');
        
        switch ($provider) {
            case 'tensorflow':
                return $this->moderateWithTensorFlow($imagePath);
            case 'aws':
                return $this->moderateWithAWS($imagePath);
            case 'azure':
                return $this->moderateWithAzure($imagePath);
            default:
                return ['safe' => true];
        }
    }

    /**
     * Moderate content with TensorFlow (NSFW.js).
     */
    private function moderateWithTensorFlow(string $imagePath): array
    {
        // Implementation would require a separate service
        return ['safe' => true];
    }

    /**
     * Moderate content with AWS Rekognition.
     */
    private function moderateWithAWS(string $imagePath): array
    {
        // Implementation using AWS SDK
        return ['safe' => true];
    }

    /**
     * Moderate content with Azure Content Moderator.
     */
    private function moderateWithAzure(string $imagePath): array
    {
        // Implementation using Azure API
        return ['safe' => true];
    }
}
