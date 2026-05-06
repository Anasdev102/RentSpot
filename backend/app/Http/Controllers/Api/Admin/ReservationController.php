<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        Reservation::completeExpiredConfirmed();

        $query = Reservation::with(['user:id,name,email', 'stadium:id,name,city', 'payment'])->latest()->latest('id');
        $query->when($request->query('search'), function ($q, $search) {
            $q->whereHas('user', fn ($user) => $user
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%"))
                ->orWhereHas('stadium', fn ($stadium) => $stadium
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%"));
        });
        $query->when($request->query('status'), fn ($q, $status) => $q->where('status', $status));
        $query->when($request->query('date'), fn ($q, $date) => $q->where('date', $date));

        return $query->cursorPaginate(15);
    }

    public function show(Reservation $reservation)
    {
        Reservation::completeExpiredConfirmed();

        return $reservation->load(['user', 'stadium.sport', 'payment']);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['pending', 'confirmed', 'cancelled', 'completed'])],
        ]);

        $reservation->update($data);

        return $reservation->load(['user', 'stadium', 'payment']);
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();

        return response()->noContent();
    }
}
