<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['user:id,name,email', 'stadium:id,name'])->latest()->latest('id');
        $query->when($request->query('search'), function ($q, $search) {
            $q->where('comment', 'like', "%{$search}%")
                ->orWhereHas('user', fn ($user) => $user
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%"))
                ->orWhereHas('stadium', fn ($stadium) => $stadium->where('name', 'like', "%{$search}%"));
        });
        $query->when($request->query('rating'), fn ($q, $rating) => $q->where('rating', $rating));
        $query->when($request->query('stadium_id'), fn ($q, $stadiumId) => $q->where('stadium_id', $stadiumId));

        return $query->cursorPaginate(15);
    }

    public function show(Review $review)
    {
        return $review->load(['user', 'stadium']);
    }

    public function update(Request $request, Review $review)
    {
        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $review->update($data);

        return $review->load(['user:id,name', 'stadium:id,name']);
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return response()->noContent();
    }
}
