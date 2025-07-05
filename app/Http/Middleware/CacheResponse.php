<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheResponse
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only cache GET requests
        if ($request->method() !== 'GET') {
            return $next($request);
        }
        
        // Don't cache authenticated requests
        if ($request->user()) {
            return $next($request);
        }
        
        // Generate cache key
        $cacheKey = 'response:' . md5($request->fullUrl());
        
        // Check if cached
        $cached = Cache::get($cacheKey);
        if ($cached) {
            return response($cached['content'])
                ->header('Content-Type', $cached['content_type'])
                ->header('X-Cache', 'HIT');
        }
        
        // Get response
        $response = $next($request);
        
        // Cache successful responses
        if ($response->isSuccessful()) {
            Cache::put($cacheKey, [
                'content' => $response->getContent(),
                'content_type' => $response->headers->get('Content-Type'),
            ], now()->addMinutes(5));
        }
        
        return $response->header('X-Cache', 'MISS');
    }
}
