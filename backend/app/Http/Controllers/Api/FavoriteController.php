<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Stadium;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()
            ->favoriteStadiums()
            ->with(['sport', 'images'])
            ->withAvg('reviews', 'rating')
            ->latest('favorites.created_at')
            ->get();
    }

    public function store(Request $request, Stadium $stadium)
    {
        abort_unless($stadium->is_active, 404);

        Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'stadium_id' => $stadium->id,
        ]);

        return response()->json([
            'message' => 'Stadium added to favorites.',
            'stadium_id' => $stadium->id,
            'is_favorite' => true,
        ], 201);
    }

    public function destroy(Request $request, Stadium $stadium)
    {
        Favorite::where('user_id', $request->user()->id)
            ->where('stadium_id', $stadium->id)
            ->delete();

        return response()->json([
            'message' => 'Stadium removed from favorites.',
            'stadium_id' => $stadium->id,
            'is_favorite' => false,
        ]);
    }
}
