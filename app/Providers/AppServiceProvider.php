<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        // 防止在生产环境中延迟加载，这是修正后的一行
        Model::preventLazyLoading(! $this->app->isProduction());
        
        // 如果是调试模式，则记录慢查询日志
        if (config('app.debug')) {
            DB::listen(function ($query) {
                if ($query->time > 100) { // 记录超过100毫秒的查询
                    Log::warning('Slow query detected', [
                        'sql' => $query->sql,
                        'bindings' => $query->bindings,
                        'time' => $query->time,
                    ]);
                }
            });
        }
    }
}
