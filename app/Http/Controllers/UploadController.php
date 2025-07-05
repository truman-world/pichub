<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\View\View;

class UploadController extends Controller
{
    /**
     * Display the upload page.
     */
    public function index(): View
    {
        return view('upload.index');
    }
}
