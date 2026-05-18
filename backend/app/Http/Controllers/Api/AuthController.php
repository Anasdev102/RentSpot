<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AdminNotificationService;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:30'],
            'role' => ['nullable', Rule::in(['user'])],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'role' => 'user',
        ]);

        AdminNotificationService::send(
            'user_registered',
            'New user',
            "{$user->name} joined RENTSPOT",
            "/admin/users?highlight={$user->id}"
        );

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('rentspot')->plainTextToken,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('rentspot')->plainTextToken,
        ]);
    }

    public function redirectToGoogle()
    {
        $frontendUrl = $this->frontendUrl();

        if (! config('services.google.client_id') || ! config('services.google.client_secret')) {
            return $this->redirectWithGoogleError($frontendUrl, 'Google login is not configured.');
        }

        try {
            return Socialite::driver('google')->stateless()->redirect();
        } catch (Throwable $exception) {
            return $this->redirectWithGoogleError($frontendUrl, 'Google login could not start. Check Google OAuth configuration.');
        }
    }

    public function handleGoogleCallback(Request $request)
    {
        $frontendUrl = $this->frontendUrl();

        if (! config('services.google.client_id') || ! config('services.google.client_secret')) {
            return $this->redirectWithGoogleError($frontendUrl, 'Google login is not configured.');
        }

        if ($request->has('error')) {
            return $this->redirectWithGoogleError(
                $frontendUrl,
                $request->query('error_description', $request->query('error'))
            );
        }

        if (! $request->has('code')) {
            return $this->redirectWithGoogleError($frontendUrl, 'Google did not return an authorization code. Start login from the Continue with Google button.');
        }

        try {
            $provider = Socialite::driver('google')->stateless();
            $provider->setHttpClient(new Client([
                'connect_timeout' => 5,
                'timeout' => 10,
            ]));

            $googleUser = $provider->user();
        } catch (Throwable $exception) {
            return $this->redirectWithGoogleError($frontendUrl, 'Google login failed. Check the redirect URI and try again from the Continue with Google button.');
        }

        try {
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName() ?: $googleUser->getNickname() ?: 'Google User',
                    'password' => Hash::make(Str::random(32)),
                    'phone' => null,
                    'role' => 'user',
                ]
            );

            $token = $user->createToken('rentspot-google')->plainTextToken;
        } catch (Throwable $exception) {
            return $this->redirectWithGoogleError($frontendUrl, 'Google login completed, but RENTSPOT could not create your session.');
        }

        return redirect()->away($frontendUrl . '/auth/google/callback?' . http_build_query([
            'token' => $token,
            'user' => base64_encode(json_encode($user)),
        ]));
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    private function frontendUrl(): string
    {
        return rtrim(env('FRONTEND_URL', 'http://127.0.0.1:5174'), '/');
    }

    private function redirectWithGoogleError(string $frontendUrl, string $message)
    {
        return redirect()->away($frontendUrl . '/login?' . http_build_query([
            'google_error' => $message,
        ]));
    }
}
