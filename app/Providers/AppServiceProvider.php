<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Prevent lazy loading in production
        Model::preventLazyLoadingIf(!app()->isProduction());
        
        // Log slow queries
        if (config('app.debug')) {
            DB::listen(function ($query) {
                if ($query->time > 100) { // 100ms
                    \Log::warning('Slow query detected', [
                        'sql' => $query->sql,
                        'bindings' => $query->bindings,
                        'time' => $query->time,
                    ]);
                }
            });
        }
        
        // Configure model caching
        if (config('cache.default') === 'redis') {
            Model::cacheMutex(function () {
                return cache()->lock('model-cache', 10);
            });
        }
    }
}
