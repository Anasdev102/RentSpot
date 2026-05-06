<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sport;

class SportController extends Controller
{
    public function index()
    {
        return Sport::withCount('stadiums')->orderBy('name')->get();
    }
}
