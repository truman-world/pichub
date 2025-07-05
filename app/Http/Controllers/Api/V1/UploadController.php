<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ChunkInitRequest;
use App\Http\Requests\Api\ChunkUploadRequest;
use App\Http\Requests\Api\CompleteChunkRequest;
use App\Http\Requests\Api\UploadRequest;
use App\Services\ImageService;
use App\Services\StorageService;
use App\Services\UploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UploadController extends Controller
{
    public function __construct(
        private readonly ImageService $imageService,
        private readonly StorageService $storageService,
        private readonly UploadService $uploadService
    ) {}

    /**
     * Handle direct file upload.
     */
    public function upload(UploadRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            
            // Check user quota
            if (!$this->uploadService->checkUserQuota($user, $request->file('file')->getSize())) {
                return response()->json([
                    'success' => false,
                    'message' => __('Storage quota exceeded'),
                ], 403);
            }
            
            // Check for duplicate by hash
            $hash = $request->input('hash');
            if ($hash && $existing = $this->imageService->findByHash($hash, $user->id)) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'id' => $existing->id,
                        'url' => $existing->url,
                        'thumbnail' => $existing->thumbnail_url,
                        'delete_url' => route('api.v1.images.destroy', $existing->id),
                        'size' => $existing->size,
                        'dimensions' => "{$existing->width}x{$existing->height}",
                    ],
                ]);
            }
            
            // Process and store image
            $image = $this->uploadService->processUpload(
                $request->file('file'),
                $user,
                $request->only(['name', 'album_id'])
            );
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'thumbnail' => $image->thumbnail_url,
                    'delete_url' => route('api.v1.images.destroy', $image->id),
                    'size' => $image->size,
                    'dimensions' => "{$image->width}x{$image->height}",
                ],
            ]);
            
        } catch (\Exception $e) {
            Log::error('Upload error', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => __('Upload failed. Please try again.'),
            ], 500);
        }
    }

    /**
     * Initialize chunk upload.
     */
    public function initializeChunk(ChunkInitRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $data = $request->validated();
            
            // Check user quota
            if (!$this->uploadService->checkUserQuota($user, $data['fileSize'])) {
                return response()->json([
                    'success' => false,
                    'message' => __('Storage quota exceeded'),
                ], 403);
            }
            
            // Initialize chunk upload session
            $session = $this->uploadService->initializeChunkUpload(
                $user,
                $data
            );
            
            return response()->json([
                'success' => true,
                'data' => [
                    'uploadId' => $session->upload_id,
                    'chunkSize' => config('pichub.upload.chunk_size'),
                ],
            ]);
            
        } catch (\Exception $e) {
            Log::error('Chunk init error', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => __('Failed to initialize upload'),
            ], 500);
        }
    }

    /**
     * Handle chunk upload.
     */
    public function uploadChunk(ChunkUploadRequest $request): JsonResponse
    {
        try {
            $result = $this->uploadService->processChunk(
                $request->input('uploadId'),
                $request->file('chunk'),
                (int) $request->input('chunkIndex')
            );
            
            if (!$result) {
                return response()->json([
                    'success' => false,
                    'message' => __('Invalid upload session'),
                ], 400);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'chunkIndex' => $request->input('chunkIndex'),
                ],
            ]);
            
        } catch (\Exception $e) {
            Log::error('Chunk upload error', [
                'upload_id' => $request->input('uploadId'),
                'chunk_index' => $request->input('chunkIndex'),
                'error' => $e->getMessage(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => __('Chunk upload failed'),
            ], 500);
        }
    }

    /**
     * Complete chunk upload.
     */
    public function completeChunk(CompleteChunkRequest $request): JsonResponse
    {
        try {
            $image = $this->uploadService->completeChunkUpload(
                $request->input('uploadId')
            );
            
            if (!$image) {
                return response()->json([
                    'success' => false,
                    'message' => __('Failed to complete upload'),
                ], 400);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'thumbnail' => $image->thumbnail_url,
                    'delete_url' => route('api.v1.images.destroy', $image->id),
                    'size' => $image->size,
                    'dimensions' => "{$image->width}x{$image->height}",
                ],
            ]);
            
        } catch (\Exception $e) {
            Log::error('Chunk complete error', [
                'upload_id' => $request->input('uploadId'),
                'error' => $e->getMessage(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => __('Failed to complete upload'),
            ], 500);
        }
    }
}
