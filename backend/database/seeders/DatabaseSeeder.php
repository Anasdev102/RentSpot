<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Sport;
use App\Models\Stadium;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@rentspot.test'],
            ['name' => 'RENTSPOT Admin', 'password' => Hash::make('password'), 'phone' => null, 'role' => 'admin']
        );

        User::updateOrCreate(
            ['email' => 'elidrissi@gmail.com'],
            ['name' => 'Elidrissi Admin', 'password' => Hash::make('celia@2006'), 'phone' => null, 'role' => 'admin']
        );

        $demoUser = User::updateOrCreate(
            ['email' => 'user@rentspot.test'],
            ['name' => 'Demo User', 'password' => Hash::make('password'), 'phone' => '+1 555 0100', 'role' => 'user']
        );

        $users = collect([
            ['name' => 'Yassine El Amrani', 'email' => 'yassine@rentspot.test', 'phone' => '+212 600 111 222'],
            ['name' => 'Sara Bennani', 'email' => 'sara@rentspot.test', 'phone' => '+212 600 333 444'],
            ['name' => 'Omar Idrissi', 'email' => 'omar@rentspot.test', 'phone' => '+212 600 555 666'],
            ['name' => 'Nadia Alaoui', 'email' => 'nadia@rentspot.test', 'phone' => '+212 600 777 888'],
        ])->mapWithKeys(fn ($user) => [
            $user['email'] => User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make('password'),
                    'phone' => $user['phone'],
                    'role' => 'user',
                ]
            ),
        ]);

        $sports = collect([
            ['name' => 'Football', 'icon' => 'football'],
            ['name' => 'Padel', 'icon' => 'padel'],
            ['name' => 'Tennis', 'icon' => 'tennis'],
            ['name' => 'Basketball', 'icon' => 'basketball'],
        ])->mapWithKeys(fn ($sport) => [$sport['name'] => Sport::updateOrCreate(['name' => $sport['name']], $sport)]);

        $stadiumRows = [
            [
                'sport' => 'Football',
                'name' => 'Arena Blue Field',
                'city' => 'Casablanca',
                'address' => 'Boulevard Zerktouni, Maarif',
                'price_per_hour' => 320,
                'capacity' => 14,
                'description' => 'Synthetic 7-a-side football field with night lighting, changing rooms, and secure parking.',
                'image' => 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
            ],
            [
                'sport' => 'Football',
                'name' => 'Atlas Five Arena',
                'city' => 'Rabat',
                'address' => 'Avenue Annakhil, Hay Riad',
                'price_per_hour' => 280,
                'capacity' => 10,
                'description' => 'Compact five-a-side football pitch for evening matches and quick team bookings.',
                'image' => 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=900&q=80',
            ],
            [
                'sport' => 'Padel',
                'name' => 'Green Court Club',
                'city' => 'Casablanca',
                'address' => 'Route d’El Jadida, Oasis',
                'price_per_hour' => 220,
                'capacity' => 4,
                'description' => 'Premium outdoor padel court with glass walls, equipment desk, and online booking.',
                'image' => 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80',
            ],
            [
                'sport' => 'Padel',
                'name' => 'Rabat Padel House',
                'city' => 'Rabat',
                'address' => 'Agdal Sports Zone',
                'price_per_hour' => 200,
                'capacity' => 4,
                'description' => 'Modern padel court with smooth surface, clear availability, and secure online payment.',
                'image' => 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80',
            ],
            [
                'sport' => 'Tennis',
                'name' => 'Goldline Tennis Park',
                'city' => 'Marrakech',
                'address' => 'Avenue Mohammed VI',
                'price_per_hour' => 180,
                'capacity' => 2,
                'description' => 'Clean tennis court with coaching-friendly slots, lighting, and quiet seating area.',
                'image' => 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80',
            ],
            [
                'sport' => 'Tennis',
                'name' => 'Palm Tennis Court',
                'city' => 'Agadir',
                'address' => 'Cité Suisse Sports Center',
                'price_per_hour' => 160,
                'capacity' => 2,
                'description' => 'Outdoor tennis court near the coast with flexible booking and easy access.',
                'image' => 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=900&q=80',
            ],
            [
                'sport' => 'Basketball',
                'name' => 'Downtown Hoops',
                'city' => 'Tangier',
                'address' => 'Corniche Sports Hall',
                'price_per_hour' => 240,
                'capacity' => 10,
                'description' => 'Indoor basketball court with polished floor, scoreboards, and team-friendly time slots.',
                'image' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
            ],
            [
                'sport' => 'Basketball',
                'name' => 'City Basket Arena',
                'city' => 'Fes',
                'address' => 'Route Imouzzer Sports Complex',
                'price_per_hour' => 210,
                'capacity' => 10,
                'description' => 'Spacious basketball court for training sessions, friendly games, and weekend bookings.',
                'image' => 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=900&q=80',
            ],
        ];

        $stadiums = collect();

        foreach ($stadiumRows as $item) {
            $stadium = Stadium::updateOrCreate(
                ['name' => $item['name']],
                [
                    'sport_id' => $sports[$item['sport']]->id,
                    'description' => $item['description'],
                    'city' => $item['city'],
                    'address' => $item['address'],
                    'price_per_hour' => $item['price_per_hour'],
                    'capacity' => $item['capacity'],
                    'is_active' => true,
                ]
            );

            $stadium->images()->delete();
            $stadium->images()->updateOrCreate(
                ['image_path' => $item['image']],
                ['is_main' => true]
            );

            $stadiums->put($stadium->name, $stadium);
        }

        $today = Carbon::today();
        $reservationRows = [
            [$demoUser, 'Arena Blue Field', $today->copy()->addDays(1)->toDateString(), '18:00', '20:00', 'confirmed', 'paid'],
            [$demoUser, 'Green Court Club', $today->copy()->addDays(3)->toDateString(), '19:00', '20:00', 'pending', 'unpaid'],
            [$demoUser, 'Goldline Tennis Park', $today->copy()->subDays(2)->toDateString(), '10:00', '11:00', 'completed', 'paid'],
            [$users['yassine@rentspot.test'], 'Atlas Five Arena', $today->copy()->addDays(2)->toDateString(), '20:00', '21:00', 'confirmed', 'paid'],
            [$users['sara@rentspot.test'], 'Rabat Padel House', $today->copy()->addDays(4)->toDateString(), '17:00', '18:30', 'pending', 'unpaid'],
            [$users['omar@rentspot.test'], 'Downtown Hoops', $today->copy()->subDays(1)->toDateString(), '21:00', '22:00', 'completed', 'paid'],
            [$users['nadia@rentspot.test'], 'City Basket Arena', $today->copy()->addDays(5)->toDateString(), '16:00', '18:00', 'cancelled', 'failed'],
            [$users['yassine@rentspot.test'], 'Palm Tennis Court', $today->copy()->subDays(7)->toDateString(), '09:00', '10:00', 'completed', 'paid'],
        ];

        foreach ($reservationRows as $index => [$user, $stadiumName, $date, $start, $end, $status, $paymentStatus]) {
            $stadium = $stadiums[$stadiumName];
            $hours = Carbon::createFromFormat('H:i', $start)->floatDiffInHours(Carbon::createFromFormat('H:i', $end));
            $reservation = Reservation::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'stadium_id' => $stadium->id,
                    'date' => $date,
                    'start_time' => $start,
                    'end_time' => $end,
                ],
                [
                    'total_price' => round($hours * (float) $stadium->price_per_hour, 2),
                    'status' => $status,
                ]
            );

            Payment::updateOrCreate(
                ['reservation_id' => $reservation->id],
                [
                    'amount' => $reservation->total_price,
                    'status' => $paymentStatus,
                    'transaction_id' => $paymentStatus === 'paid' ? 'SIM-' . strtoupper(substr(str_replace('-', '', $reservation->id), 0, 12)) : null,
                    'paid_at' => $paymentStatus === 'paid' ? now()->subHours($index + 1) : null,
                ]
            );
        }

        $reviewRows = [
            [$demoUser, 'Goldline Tennis Park', 5, 'Great court, smooth booking and clean changing area.'],
            [$users['omar@rentspot.test'], 'Downtown Hoops', 4, 'Good indoor court and fair price for team training.'],
            [$users['yassine@rentspot.test'], 'Palm Tennis Court', 5, 'Nice surface and easy access. I will book again.'],
            [$users['sara@rentspot.test'], 'Green Court Club', 4, 'Premium padel court, lights are excellent at night.'],
            [$users['nadia@rentspot.test'], 'Arena Blue Field', 5, 'Perfect football field for weekend matches.'],
        ];

        foreach ($reviewRows as [$user, $stadiumName, $rating, $comment]) {
            Review::updateOrCreate(
                ['user_id' => $user->id, 'stadium_id' => $stadiums[$stadiumName]->id],
                ['rating' => $rating, 'comment' => $comment]
            );
        }
    }
}
