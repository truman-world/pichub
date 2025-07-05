<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IpWhitelist
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $whitelist = config('security.ip_whitelist', []);
        
        if (empty($whitelist)) {
            return $next($request);
        }
        
        $clientIp = $request->ip();
        
        foreach ($whitelist as $ip) {
            if ($this->ipMatch($clientIp, $ip)) {
                return $next($request);
            }
        }
        
        abort(403, 'Access denied');
    }
    
    /**
     * Check if IP matches pattern (supports wildcards and CIDR).
     */
    private function ipMatch(string $ip, string $pattern): bool
    {
        // Exact match
        if ($ip === $pattern) {
            return true;
        }
        
        // Wildcard match (e.g., 192.168.1.*)
        if (strpos($pattern, '*') !== false) {
            $pattern = str_replace('*', '.*', $pattern);
            return preg_match('/^' . $pattern . '$/', $ip);
        }
        
        // CIDR match (e.g., 192.168.1.0/24)
        if (strpos($pattern, '/') !== false) {
            list($subnet, $bits) = explode('/', $pattern);
            $ip = ip2long($ip);
            $subnet = ip2long($subnet);
            $mask = -1 << (32 - $bits);
            $subnet &= $mask;
            return ($ip & $mask) == $subnet;
        }
        
        return false;
    }
}
