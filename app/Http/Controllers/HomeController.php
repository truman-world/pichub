<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\View\View;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index(): View
    {
        return view('welcome');
    }
}
