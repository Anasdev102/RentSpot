<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminNotificationService
{
    public static function send(string $type, string $title, string $message, string $targetUrl): void
    {
        $now = now();

        $rows = User::where('role', 'admin')->get(['id'])->map(fn (User $admin) => [
            'id' => (string) Str::uuid(),
            'type' => $type,
            'notifiable_type' => User::class,
            'notifiable_id' => $admin->id,
            'data' => json_encode([
                'title' => $title,
                'message' => $message,
                'target_url' => $targetUrl,
            ]),
            'read_at' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        if ($rows !== []) {
            DB::table('notifications')->insert($rows);
        }
    }
}
