<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\View\View;

class GalleryController extends Controller
{
    /**
     * Display the gallery page.
     */
    public function index(): View
    {
        return view('gallery.index');
    }
}
