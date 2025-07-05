<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ChunkUpload;
use App\Models\Image;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadService
{
    public function __construct(
        private readonly ImageService $imageService,
        private readonly StorageService $storageService,
        private readonly SecurityService $securityService
    ) {}

    /**
     * Check if user has enough storage quota.
     */
    public function checkUserQuota(User $user, int $fileSize): bool
    {
        return ($user->storage_used + $fileSize) <= $user->storage_limit;
    }

    /**
     * Process file upload.
     */
    public function processUpload(UploadedFile $file, User $user, array $options = []): Image
    {
        // Security checks
        $this->securityService->validateFile($file);
        
        // Process image
        $image = $this->imageService->processImage($file, $user, $options);
        
        // Backup to secondary storage
        $this->storageService->backup($image);
        
        // Queue additional processing
        dispatch(new \App\Jobs\ProcessImageThumbnails($image));
        dispatch(new \App\Jobs\ExtractImageMetadata($image));
        
        // Cache image data
        $this->cacheImageData($image);
        
        return $image;
    }

    /**
     * Initialize chunk upload session.
     */
    public function initializeChunkUpload(User $user, array $data): ChunkUpload
    {
        return ChunkUpload::create([
            'upload_id' => $data['uploadId'],
            'user_id' => $user->id,
            'filename' => $data['fileName'],
            'file_size' => $data['fileSize'],
            'file_type' => $data['fileType'],
            'hash' => $data['hash'],
            'total_chunks' => $data['totalChunks'],
            'uploaded_chunks' => 0,
            'chunk_data' => [],
            'expires_at' => now()->addHours(24),
        ]);
    }

    /**
     * Process chunk upload.
     */
    public function processChunk(string $uploadId, UploadedFile $chunk, int $chunkIndex): bool
    {
        $session = ChunkUpload::where('upload_id', $uploadId)
            ->where('expires_at', '>', now())
            ->first();
            
        if (!$session) {
            return false;
        }
        
        // Store chunk
        $chunkPath = "chunks/{$uploadId}/{$chunkIndex}";
        Storage::put($chunkPath, file_get_contents($chunk->getRealPath()));
        
        // Update session
        $chunkData = $session->chunk_data;
        $chunkData[$chunkIndex] = [
            'path' => $chunkPath,
            'size' => $chunk->getSize(),
            'uploaded_at' => now()->toDateTimeString(),
        ];
        
        $session->update([
            'uploaded_chunks' => count($chunkData),
            'chunk_data' => $chunkData,
        ]);
        
        return true;
    }

    /**
     * Complete chunk upload.
     */
    public function completeChunkUpload(string $uploadId): ?Image
    {
        $session = ChunkUpload::where('upload_id', $uploadId)->first();
        
        if (!$session || $session->uploaded_chunks !== $session->total_chunks) {
            return null;
        }
        
        DB::beginTransaction();
        
        try {
            // Merge chunks
            $tempPath = "temp/{$uploadId}";
            $this->mergeChunks($session, $tempPath);
            
            // Create UploadedFile instance
            $file = new UploadedFile(
                Storage::path($tempPath),
                $session->filename,
                $session->file_type,
                null,
                true
            );
            
            // Process as normal upload
            $image = $this->processUpload($file, $session->user, [
                'name' => $session->filename,
            ]);
            
            // Clean up
            $this->cleanupChunks($session);
            Storage::delete($tempPath);
            $session->delete();
            
            DB::commit();
            
            return $image;
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Merge uploaded chunks.
     */
    private function mergeChunks(ChunkUpload $session, string $outputPath): void
    {
        $outputStream = Storage::writeStream($outputPath);
        
        // Sort chunks by index
        ksort($session->chunk_data);
        
        foreach ($session->chunk_data as $index => $chunkInfo) {
            $chunkStream = Storage::readStream($chunkInfo['path']);
            stream_copy_to_stream($chunkStream, $outputStream);
            fclose($chunkStream);
        }
        
        fclose($outputStream);
    }

    /**
     * Clean up chunk files.
     */
    private function cleanupChunks(ChunkUpload $session): void
    {
        foreach ($session->chunk_data as $chunkInfo) {
            Storage::delete($chunkInfo['path']);
        }
        
        Storage::deleteDirectory("chunks/{$session->upload_id}");
    }

    /**
     * Cache image data for quick access.
     */
    private function cacheImageData(Image $image): void
    {
        $cacheKey = "image:{$image->id}";
        $cacheTTL = 3600; // 1 hour
        
        Cache::put($cacheKey, [
            'id' => $image->id,
            'url' => $image->url,
            'thumbnail_url' => $image->thumbnail_url,
            'width' => $image->width,
            'height' => $image->height,
            'size' => $image->size,
        ], $cacheTTL);
    }
}
