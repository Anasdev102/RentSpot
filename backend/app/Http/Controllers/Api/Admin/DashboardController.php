<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Sport;
use App\Models\Stadium;
use App\Models\User;

class DashboardController extends Controller
{
    public function __invoke()
    {
        Reservation::completeExpiredConfirmed();

        return response()->json([
            'stats' => [
                'total_users' => User::where('role', 'user')->count(),
                'total_sports' => Sport::count(),
                'total_stadiums' => Stadium::count(),
                'reservations' => Reservation::count(),
                'revenue' => Payment::where('status', Payment::STATUS_PAID)->sum('amount'),
            ],
            'recent_reservations' => Reservation::with(['user:id,name,email', 'stadium:id,name,city', 'payment'])
                ->latest()
                ->limit(8)
                ->get(),
            'reservation_statuses' => Reservation::selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
            'payment_statuses' => Payment::selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
            'latest_reviews' => Review::with(['user:id,name', 'stadium:id,name'])
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
