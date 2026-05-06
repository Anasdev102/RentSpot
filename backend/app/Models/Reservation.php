<?php

namespace App\Models;

use App\Services\UserNotificationService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reservation extends Model
{
    use HasFactory;
    use HasUuids;

    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'user_id',
        'stadium_id',
        'date',
        'start_time',
        'end_time',
        'total_price',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'total_price' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function stadium(): BelongsTo
    {
        return $this->belongsTo(Stadium::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public static function completeExpiredConfirmed(): int
    {
        $completed = static::where('status', self::STATUS_CONFIRMED)
            ->with('stadium:id,name')
            ->get(['id', 'user_id', 'stadium_id', 'date', 'end_time'])
            ->filter(fn (Reservation $reservation) => Carbon::parse($reservation->date->format('Y-m-d') . ' ' . $reservation->end_time)->lessThanOrEqualTo(now()))
            ->each(function (Reservation $reservation) {
                $reservation->update(['status' => self::STATUS_COMPLETED]);

                UserNotificationService::send(
                    $reservation->user_id,
                    'reservation_completed',
                    'Reservation completed',
                    'Your reservation for ' . ($reservation->stadium?->name ?? 'the stadium') . ' is now completed.',
                    '/dashboard'
                );
            });

        return $completed->count();
    }
}
