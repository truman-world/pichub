<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\View\View;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(): View
    {
        $user = auth()->user();
        $stats = [
            'total_images' => $user->images()->count(),
            'total_albums' => $user->albums()->count(),
            'storage_used' => $user->storage_used,
            'storage_limit' => $user->storage_limit,
        ];
        
        return view('dashboard', compact('stats'));
    }
}
