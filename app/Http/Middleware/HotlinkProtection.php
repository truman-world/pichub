<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HotlinkProtection
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only check for image requests
        if (!$this->isImageRequest($request)) {
            return $next($request);
        }
        
        // Check if hotlink protection is enabled
        if (!config('pichub.security.enable_hotlink_protection')) {
            return $next($request);
        }
        
        // Allow direct access (no referer)
        $referer = $request->headers->get('referer');
        if (!$referer) {
            return $next($request);
        }
        
        // Parse referer domain
        $refererHost = parse_url($referer, PHP_URL_HOST);
        if (!$refererHost) {
            return $this->blockAccess();
        }
        
        // Check allowed domains
        $allowedDomains = array_merge(
            [parse_url(config('app.url'), PHP_URL_HOST)],
            config('pichub.security.allowed_domains', [])
        );
        
        foreach ($allowedDomains as $domain) {
            if ($this->domainMatch($refererHost, $domain)) {
                return $next($request);
            }
        }
        
        return $this->blockAccess();
    }
    
    /**
     * Check if request is for an image.
     */
    private function isImageRequest(Request $request): bool
    {
        $path = $request->path();
        return strpos($path, 'storage/images/') === 0 || 
               strpos($path, 'storage/thumbnails/') === 0;
    }
    
    /**
     * Check if domain matches pattern.
     */
    private function domainMatch(string $host, string $pattern): bool
    {
        // Exact match
        if ($host === $pattern) {
            return true;
        }
        
        // Wildcard subdomain match (*.example.com)
        if (strpos($pattern, '*.') === 0) {
            $domain = substr($pattern, 2);
            return substr($host, -strlen($domain)) === $domain;
        }
        
        return false;
    }
    
    /**
     * Block access with hotlink protection image.
     */
    private function blockAccess(): Response
    {
        $imagePath = public_path('images/hotlink-protected.png');
        
        if (file_exists($imagePath)) {
            return response()->file($imagePath, [
                'Content-Type' => 'image/png',
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
            ]);
        }
        
        abort(403, 'Hotlinking not allowed');
    }
}
