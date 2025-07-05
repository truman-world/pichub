<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Album;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    /**
     * Display a listing of albums.
     */
    public function index(Request $request): JsonResponse
    {
        $albums = $request->user()->albums()->paginate(20);

        return response()->json([
            'data' => $albums,
        ]);
    }

    /**
     * Store a newly created album.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        $album = $request->user()->albums()->create($validated);

        return response()->json([
            'data' => $album,
        ], 201);
    }

    /**
     * Display the specified album.
     */
    public function show(Album $album): JsonResponse
    {
        $this->authorize('view', $album);

        return response()->json([
            'data' => $album->load('images'),
        ]);
    }

    /**
     * Update the specified album.
     */
    public function update(Request $request, Album $album): JsonResponse
    {
        $this->authorize('update', $album);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        $album->update($validated);

        return response()->json([
            'data' => $album,
        ]);
    }

    /**
     * Remove the specified album.
     */
    public function destroy(Album $album): JsonResponse
    {
        $this->authorize('delete', $album);

        $album->delete();

        return response()->json([
            'message' => 'Album deleted successfully',
        ]);
    }
}
