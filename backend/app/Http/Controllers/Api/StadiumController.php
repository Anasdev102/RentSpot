<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stadium;
use Illuminate\Http\Request;

class StadiumController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'sport_id' => ['nullable', 'exists:sports,id'],
            'city' => ['nullable', 'string', 'max:255'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'sort' => ['nullable', 'in:price_asc,price_desc,rating_desc,newest'],
        ]);

        $query = Stadium::query()
            ->with(['sport', 'images'])
            ->withAvg('reviews', 'rating')
            ->where('is_active', true);

        $query->when($data['sport_id'] ?? null, fn ($q, $sportId) => $q->where('sport_id', $sportId));
        $query->when($data['city'] ?? null, fn ($q, $city) => $q->where('city', 'like', "%{$city}%"));
        $query->when($data['min_price'] ?? null, fn ($q, $price) => $q->where('price_per_hour', '>=', $price));
        $query->when($data['max_price'] ?? null, fn ($q, $price) => $q->where('price_per_hour', '<=', $price));

        match ($data['sort'] ?? 'newest') {
            'price_asc' => $query->orderBy('price_per_hour'),
            'price_desc' => $query->orderByDesc('price_per_hour'),
            'rating_desc' => $query->orderByDesc('reviews_avg_rating'),
            default => $query->latest(),
        };

        $query->orderByDesc('id');

        return $query->cursorPaginate(12);
    }

    public function cities()
    {
        return Stadium::query()
            ->where('is_active', true)
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->select('city')
            ->distinct()
            ->orderBy('city')
            ->pluck('city');
    }

    public function show(Stadium $stadium)
    {
        abort_unless($stadium->is_active, 404);

        return $stadium->load([
            'sport',
            'images',
            'reviews.user:id,name',
            'reservations' => fn ($query) => $query
                ->whereIn('status', ['pending', 'confirmed'])
                ->select('id', 'stadium_id', 'date', 'start_time', 'end_time', 'status'),
        ])->loadAvg('reviews', 'rating');
    }
}
