<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStadiumRequest;
use App\Http\Requests\UpdateStadiumRequest;
use App\Http\Resources\StadiumResource;
use App\Models\Stadium;

class StadiumController extends Controller
{
    public function store(StoreStadiumRequest $request)
    {
        $stadium = Stadium::create($request->only([
            'name',
            'description',
            'price_per_hour',
            'location'
        ]));

        // Upload Images
        if ($request->hasFile('images')) {

            foreach ($request->file('images') as $image) {

                $path = $image->store('stadiums', 'public');

                $stadium->images()->create([
                    'path' => $path
                ]);
            }
        }

        return response()->json([
            "message" => "Stadium created successfully",
            "data" => new StadiumResource($stadium->load('images'))
        ], 201);
    }

    public function index()
    {
        $stadiums = Stadium::with('images')->get();
        return StadiumResource::collection($stadiums);
    }

    public function show(Stadium $stadium)
    {
        $stadium->load('images');
        return new StadiumResource($stadium);
    }

    public function update(UpdateStadiumRequest $request, Stadium $stadium)
    {
        $stadium->update($request->all());

        return response()->json([
            'message' => 'Stadium updated successfully',
            'data' => new StadiumResource($stadium)
        ]);
    }

    public function destroy(Stadium $stadium)
    {
        $stadium->delete();

        return response()->json([
            'message' => 'Deleted successfully'
        ]);
    }
}
