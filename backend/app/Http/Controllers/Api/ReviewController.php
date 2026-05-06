<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Review;
use App\Services\AdminNotificationService;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'stadium_id' => ['required', 'exists:stadiums,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $canReview = Reservation::where('user_id', $request->user()->id)
            ->where('stadium_id', $data['stadium_id'])
            ->where('status', Reservation::STATUS_COMPLETED)
            ->exists();

        if (! $canReview) {
            abort(422, 'You can review a stadium after a completed reservation.');
        }

        $review = Review::updateOrCreate(
            ['user_id' => $request->user()->id, 'stadium_id' => $data['stadium_id']],
            ['rating' => $data['rating'], 'comment' => $data['comment'] ?? null]
        );

        $review->load(['user:id,name', 'stadium:id,name']);

        AdminNotificationService::send(
            'review_created',
            'New review',
            "{$review->user->name} reviewed {$review->stadium->name}",
            "/admin/reviews?highlight={$review->id}"
        );

        return response()->json($review, 201);
    }
}
