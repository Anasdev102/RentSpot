<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['reservation.user:id,name,email', 'reservation.stadium:id,name'])->latest()->latest('id');
        $query->when($request->query('search'), function ($q, $search) {
            $q->where('transaction_id', 'like', "%{$search}%")
                ->orWhereHas('reservation.user', fn ($user) => $user
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%"))
                ->orWhereHas('reservation.stadium', fn ($stadium) => $stadium->where('name', 'like', "%{$search}%"));
        });
        $query->when($request->query('status'), fn ($q, $status) => $q->where('status', $status));

        return $query->cursorPaginate(15);
    }

    public function show(Payment $payment)
    {
        return $payment->load(['reservation.user', 'reservation.stadium']);
    }

    public function update(Request $request, Payment $payment)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['unpaid', 'paid', 'failed', 'refunded'])],
            'transaction_id' => ['nullable', 'string', 'max:255'],
        ]);

        $data['paid_at'] = $data['status'] === Payment::STATUS_PAID ? ($payment->paid_at ?? now()) : null;
        $payment->update($data);

        return $payment->load('reservation');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->noContent();
    }
}
