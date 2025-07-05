<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ImageResource;
use App\Models\Image;
use App\Services\ImageService;
use App\Services\StorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class ImageController extends Controller
{
    public function __construct(
        private readonly ImageService $imageService,
        private readonly StorageService $storageService
    ) {}

    /**
     * Display a listing of images.
     */
    public function index(Request $request): JsonResponse
    {
        $query = auth()->user()->images();
        
        // Apply filters
        if ($request->filled('dateFrom')) {
            $query->whereDate('created_at', '>=', $request->input('dateFrom'));
        }
        
        if ($request->filled('dateTo')) {
            $query->whereDate('created_at', '<=', $request->input('dateTo'));
        }
        
        if ($request->filled('types')) {
            $types = is_array($request->input('types')) 
                ? $request->input('types') 
                : explode(',', $request->input('types'));
                
            $mimeTypes = array_map(function ($type) {
                return "image/{$type}";
            }, $types);
            
            $query->whereIn('mime_type', $mimeTypes);
        }
        
        if ($request->filled('sizeRange')) {
            $range = $request->input('sizeRange');
            switch ($range) {
                case '0-1':
                    $query->where('size', '<', 1048576); // 1MB
                    break;
                case '1-5':
                    $query->whereBetween('size', [1048576, 5242880]); // 1-5MB
                    break;
                case '5-10':
                    $query->whereBetween('size', [5242880, 10485760]); // 5-10MB
                    break;
                case '10-50':
                    $query->whereBetween('size', [10485760, 52428800]); // 10-50MB
                    break;
                case '50+':
                    $query->where('size', '>', 52428800); // >50MB
                    break;
            }
        }
        
        if ($request->filled('albumId')) {
            $query->whereHas('albums', function ($q) use ($request) {
                $q->where('albums.id', $request->input('albumId'));
            });
        }
        
        // Sorting
        $sortBy = $request->input('sort', 'created_at');
        $sortOrder = $request->input('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        // Pagination
        $images = $query->paginate($request->input('per_page', 20));
        
        return response()->json([
            'data' => ImageResource::collection($images),
            'meta' => [
                'current_page' => $images->currentPage(),
                'last_page' => $images->lastPage(),
                'per_page' => $images->perPage(),
                'total' => $images->total(),
            ],
        ]);
    }

    /**
     * Display the specified image.
     */
    public function show(Image $image): JsonResponse
    {
        $this->authorize('view', $image);
        
        // Increment views
        $image->incrementViews();
        
        return response()->json([
            'data' => new ImageResource($image),
        ]);
    }

    /**
     * Update the specified image.
     */
    public function update(Request $request, Image $image): JsonResponse
    {
        $this->authorize('update', $image);
        
        $validated = $request->validate([
            'original_name' => ['sometimes', 'string', 'max:255'],
            'is_public' => ['sometimes', 'boolean'],
            'expires_at' => ['sometimes', 'nullable', 'date', 'after:now'],
        ]);
        
        $image->update($validated);
        
        return response()->json([
            'data' => new ImageResource($image),
        ]);
    }

    /**
     * Remove the specified image.
     */
    public function destroy(Image $image): JsonResponse
    {
        $this->authorize('delete', $image);
        
        DB::beginTransaction();
        
        try {
            // Delete files
            $this->storageService->delete($image->path);
            
            if (!empty($image->thumbnails)) {
                foreach ($image->thumbnails as $thumbnail) {
                    $this->storageService->delete($thumbnail);
                }
            }
            
            // Update user storage
            $image->user->decrement('storage_used', $image->size);
            
            // Delete record
            $image->delete();
            
            DB::commit();
            
            return response()->json([
                'message' => __('Image deleted successfully'),
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => __('Failed to delete image'),
            ], 500);
        }
    }

    /**
     * Batch delete images.
     */
    public function batchDelete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:images,id'],
        ]);
        
        $images = Image::whereIn('id', $validated['ids'])
            ->where('user_id', auth()->id())
            ->get();
        
        DB::beginTransaction();
        
        try {
            $totalSize = 0;
            
            foreach ($images as $image) {
                // Delete files
                $this->storageService->delete($image->path);
                
                if (!empty($image->thumbnails)) {
                    foreach ($image->thumbnails as $thumbnail) {
                        $this->storageService->delete($thumbnail);
                    }
                }
                
                $totalSize += $image->size;
                $image->delete();
            }
            
            // Update user storage
            auth()->user()->decrement('storage_used', $totalSize);
            
            DB::commit();
            
            return response()->json([
                'message' => __('Images deleted successfully'),
                'deleted' => $images->count(),
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => __('Failed to delete images'),
            ], 500);
        }
    }

    /**
     * Batch download images.
     */
    public function batchDownload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:images,id'],
        ]);
        
        $images = Image::whereIn('id', $validated['ids'])
            ->where('user_id', auth()->id())
            ->get();
        
        if ($images->isEmpty()) {
            return response()->json([
                'message' => __('No images found'),
            ], 404);
        }
        
        // Create zip file
        $zipFilename = 'images_' . time() . '.zip';
        $zipPath = storage_path('app/temp/' . $zipFilename);
        
        // Ensure temp directory exists
        if (!is_dir(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }
        
        $zip = new ZipArchive();
        
        if ($zip->open($zipPath, ZipArchive::CREATE) === true) {
            foreach ($images as $image) {
                $filePath = Storage::path($image->path);
                if (file_exists($filePath)) {
                    $zip->addFile($filePath, $image->original_name);
                }
            }
            $zip->close();
            
            // Generate temporary download URL
            $downloadUrl = route('download.temp', [
                'file' => encrypt($zipFilename),
            ]);
            
            return response()->json([
                'download_url' => $downloadUrl,
            ]);
        }
        
        return response()->json([
            'message' => __('Failed to create download archive'),
        ], 500);
    }

    /**
     * Batch move images to album.
     */
    public function batchMove(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:images,id'],
            'album_id' => ['required', 'integer', 'exists:albums,id'],
        ]);
        
        $images = Image::whereIn('id', $validated['ids'])
            ->where('user_id', auth()->id())
            ->get();
        
        $album = auth()->user()->albums()->find($validated['album_id']);
        
        if (!$album) {
            return response()->json([
                'message' => __('Album not found'),
            ], 404);
        }
        
        DB::beginTransaction();
        
        try {
            foreach ($images as $image) {
                // Sync to new album (this will detach from other albums)
                $image->albums()->sync([$album->id]);
            }
            
            DB::commit();
            
            return response()->json([
                'message' => __('Images moved to album successfully'),
                'moved' => $images->count(),
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => __('Failed to move images'),
            ], 500);
        }
    }
}
