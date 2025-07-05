<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
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
