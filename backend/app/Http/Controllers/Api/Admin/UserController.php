<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AdminNotificationService;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->latest()->latest('id');
        $query->when($request->query('role'), fn ($q, $role) => $q->where('role', $role));
        $query->when($request->query('search'), function ($q, $search) {
            $q->where(fn ($inner) => $inner
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%"));
        });

        return $query->cursorPaginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:30'],
            'role' => ['required', Rule::in(['user', 'admin'])],
        ]);

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        AdminNotificationService::send(
            'user_created',
            'User created',
            "{$user->name} was added by admin",
            "/admin/users?highlight={$user->id}"
        );

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return $user->loadCount(['reservations', 'reviews']);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:30'],
            'role' => ['required', Rule::in(['user', 'admin'])],
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return $user;
    }

    public function destroy(User $user)
    {
        try {
            $user->delete();
        } catch (QueryException $exception) {
            return response()->json([
                'message' => 'This user cannot be deleted because they are linked to reservations.',
            ], 422);
        }

        return response()->noContent();
    }
}
