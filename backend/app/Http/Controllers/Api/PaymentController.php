<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use App\Services\AdminNotificationService;
use App\Services\UserNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function createPaypalOrder(Request $request, Reservation $reservation)
    {
        abort_unless((string) $reservation->user_id === (string) $request->user()->id, 403);

        if ($reservation->status === Reservation::STATUS_CANCELLED) {
            abort(422, 'Cancelled reservations cannot be paid.');
        }

        $payment = $reservation->payment()->firstOrFail();

        if ($payment->status === Payment::STATUS_PAID) {
            abort(422, 'This reservation is already paid.');
        }

        $token = $this->paypalAccessToken();
        $currency = config('paypal.currency');

        $response = Http::withToken($token)
            ->acceptJson()
            ->asJson()
            ->post(config('paypal.base_url') . '/v2/checkout/orders', [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'reference_id' => (string) $reservation->id,
                        'description' => 'RENTSPOT reservation #' . $reservation->id,
                        'amount' => [
                            'currency_code' => $currency,
                            'value' => number_format((float) $payment->amount, 2, '.', ''),
                        ],
                    ],
                ],
            ]);

        if ($response->failed()) {
            abort(422, $response->json('message') ?: 'Unable to create PayPal order.');
        }

        return response()->json([
            'id' => $response->json('id'),
            'status' => $response->json('status'),
        ]);
    }

    public function capturePaypalOrder(Request $request, Reservation $reservation)
    {
        abort_unless((string) $reservation->user_id === (string) $request->user()->id, 403);

        $data = $request->validate([
            'paypal_order_id' => ['required', 'string', 'max:36'],
        ]);

        $token = $this->paypalAccessToken();

        $response = Http::withToken($token)
            ->acceptJson()
            ->asJson()
            ->post(config('paypal.base_url') . "/v2/checkout/orders/{$data['paypal_order_id']}/capture", []);

        if ($response->failed()) {
            abort(422, $response->json('message') ?: 'Unable to capture PayPal payment.');
        }

        $capture = data_get($response->json(), 'purchase_units.0.payments.captures.0');

        if (($capture['status'] ?? null) !== 'COMPLETED') {
            abort(422, 'PayPal payment was not completed.');
        }

        $payment = DB::transaction(function () use ($reservation, $capture) {
            $payment = $reservation->payment()->lockForUpdate()->firstOrFail();

            $payment->update([
                'status' => Payment::STATUS_PAID,
                'transaction_id' => $capture['id'],
                'paid_at' => now(),
            ]);

            $reservation->update(['status' => Reservation::STATUS_CONFIRMED]);

            return $payment;
        });

        $payment->load('reservation.user', 'reservation.stadium');

        AdminNotificationService::send(
            'payment_paid',
            'Payment completed',
            "{$payment->reservation->user->name} paid \${$payment->amount} for {$payment->reservation->stadium->name}",
            "/admin/payments?highlight={$payment->id}"
        );

        UserNotificationService::send(
            $payment->reservation->user,
            'payment_paid',
            'Payment confirmed',
            "Your payment for {$payment->reservation->stadium->name} was confirmed.",
            '/dashboard'
        );

        return $payment;
    }

    public function pay(Request $request, Reservation $reservation)
    {
        abort_unless((string) $reservation->user_id === (string) $request->user()->id, 403);

        if ($reservation->status === Reservation::STATUS_CANCELLED) {
            abort(422, 'Cancelled reservations cannot be paid.');
        }

        $payment = DB::transaction(function () use ($reservation) {
            $payment = $reservation->payment()->lockForUpdate()->firstOrFail();

            if ($payment->status === Payment::STATUS_PAID) {
                return $payment;
            }

            $payment->update([
                'status' => Payment::STATUS_PAID,
                'transaction_id' => 'SIM-' . Str::upper(Str::random(12)),
                'paid_at' => now(),
            ]);

            $reservation->update(['status' => Reservation::STATUS_CONFIRMED]);

            return $payment;
        });

        $payment->load('reservation.user', 'reservation.stadium');

        AdminNotificationService::send(
            'payment_paid',
            'Payment completed',
            "{$payment->reservation->user->name} paid \${$payment->amount} for {$payment->reservation->stadium->name}",
            "/admin/payments?highlight={$payment->id}"
        );

        UserNotificationService::send(
            $payment->reservation->user,
            'payment_paid',
            'Payment confirmed',
            "Your payment for {$payment->reservation->stadium->name} was confirmed.",
            '/dashboard'
        );

        return $payment;
    }

    private function paypalAccessToken(): string
    {
        if (! config('paypal.client_id') || ! config('paypal.client_secret')) {
            abort(422, 'PayPal credentials are not configured.');
        }

        $response = Http::asForm()
            ->withBasicAuth(config('paypal.client_id'), config('paypal.client_secret'))
            ->post(config('paypal.base_url') . '/v1/oauth2/token', [
                'grant_type' => 'client_credentials',
            ]);

        if ($response->failed()) {
            abort(422, $response->json('error_description') ?: 'Unable to authenticate with PayPal.');
        }

        return $response->json('access_token');
    }
}
