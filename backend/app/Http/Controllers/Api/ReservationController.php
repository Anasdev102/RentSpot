<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Stadium;
use App\Services\AdminNotificationService;
use App\Services\UserNotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        Reservation::completeExpiredConfirmed();

        return $request->user()
            ->reservations()
            ->with(['stadium.sport', 'stadium.images', 'payment'])
            ->latest()
            ->latest('id')
            ->cursorPaginate(10);
    }

    public function store(Request $request)
    {
        Reservation::completeExpiredConfirmed();

        $data = $request->validate([
            'stadium_id' => ['required', 'exists:stadiums,id'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ]);

        $startsAt = Carbon::createFromFormat('Y-m-d H:i', "{$data['date']} {$data['start_time']}");

        if ($startsAt->lessThanOrEqualTo(now())) {
            throw ValidationException::withMessages([
                'start_time' => ['Reservation start time must be in the future.'],
            ]);
        }

        $reservation = DB::transaction(function () use ($data, $request) {
            $stadium = Stadium::where('is_active', true)->lockForUpdate()->findOrFail($data['stadium_id']);

            $hasOverlap = Reservation::where('stadium_id', $stadium->id)
                ->where('date', $data['date'])
                ->whereIn('status', ['pending', 'confirmed'])
                ->where('start_time', '<', $data['end_time'])
                ->where('end_time', '>', $data['start_time'])
                ->lockForUpdate()
                ->exists();

            if ($hasOverlap) {
                abort(422, 'This time slot is already booked.');
            }

            $hours = Carbon::createFromFormat('H:i', $data['start_time'])
                ->floatDiffInHours(Carbon::createFromFormat('H:i', $data['end_time']));

            $reservation = Reservation::create([
                'user_id' => $request->user()->id,
                'stadium_id' => $stadium->id,
                'date' => $data['date'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'total_price' => round($hours * (float) $stadium->price_per_hour, 2),
                'status' => Reservation::STATUS_PENDING,
            ]);

            Payment::create([
                'reservation_id' => $reservation->id,
                'amount' => $reservation->total_price,
                'status' => Payment::STATUS_UNPAID,
            ]);

            return $reservation;
        });

        $reservation->load(['stadium', 'payment', 'user']);

        AdminNotificationService::send(
            'reservation_created',
            'New reservation',
            "{$reservation->user->name} booked {$reservation->stadium->name}",
            "/admin/reservations?highlight={$reservation->id}"
        );

        UserNotificationService::send(
            $reservation->user,
            'reservation_created',
            'Reservation created',
            "Your reservation for {$reservation->stadium->name} is pending payment.",
            '/dashboard'
        );

        return response()->json($reservation, 201);
    }

    public function cancel(Request $request, Reservation $reservation)
    {
        abort_unless((string) $reservation->user_id === (string) $request->user()->id, 403);

        if ($reservation->status !== Reservation::STATUS_PENDING) {
            abort(422, 'Only pending reservations can be cancelled.');
        }

        $reservation->update(['status' => Reservation::STATUS_CANCELLED]);

        $reservation->load(['stadium', 'payment', 'user']);

        AdminNotificationService::send(
            'reservation_cancelled',
            'Reservation cancelled',
            "{$reservation->user->name} cancelled {$reservation->stadium->name}",
            "/admin/reservations?highlight={$reservation->id}"
        );

        UserNotificationService::send(
            $reservation->user,
            'reservation_cancelled',
            'Reservation cancelled',
            "Your reservation for {$reservation->stadium->name} was cancelled.",
            '/dashboard'
        );

        return $reservation;
    }
}
