<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sport;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SportController extends Controller
{
    public function index(Request $request)
    {
        $query = Sport::withCount('stadiums')->orderBy('name')->orderBy('id');
        $query->when($request->query('search'), fn ($q, $search) => $q->where('name', 'like', "%{$search}%"));

        return $query->cursorPaginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:sports,name'],
            'icon' => ['nullable', 'string', 'max:255'],
        ]);

        return response()->json(Sport::create($data), 201);
    }

    public function show(Sport $sport)
    {
        return $sport->loadCount('stadiums');
    }

    public function update(Request $request, Sport $sport)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('sports', 'name')->ignore($sport->id)],
            'icon' => ['nullable', 'string', 'max:255'],
        ]);

        $sport->update($data);

        return $sport;
    }

    public function destroy(Sport $sport)
    {
        try {
            $sport->delete();
        } catch (QueryException $exception) {
            return response()->json([
                'message' => 'This sport cannot be deleted because it is linked to stadiums.',
            ], 422);
        }

        return response()->noContent();
    }
}
