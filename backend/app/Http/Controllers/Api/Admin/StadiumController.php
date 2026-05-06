<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Stadium;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StadiumController extends Controller
{
    public function index(Request $request)
    {
        $query = Stadium::with(['sport', 'images'])->withAvg('reviews', 'rating')->latest()->latest('id');
        $query->when($request->query('search'), fn ($q, $search) => $q->where('name', 'like', "%{$search}%"));
        $query->when($request->query('city'), fn ($q, $city) => $q->where('city', 'like', "%{$city}%"));
        $query->when($request->query('sport_id'), fn ($q, $sportId) => $q->where('sport_id', $sportId));

        return $query->cursorPaginate(15);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $uploadedImages = $this->uploadedImages($request);
        $images = $data['images'] ?? [];
        $mainImageIndex = (int) ($data['main_image_index'] ?? 0);
        unset($data['images']);
        unset($data['main_image_index']);

        $stadium = Stadium::create($data);

        if ($uploadedImages) {
            $this->storeUploadedImages($stadium, $uploadedImages, $mainImageIndex);
        } else {
            $this->syncImages($stadium, $images);
        }

        return response()->json($stadium->load(['sport', 'images']), 201);
    }

    public function show(Stadium $stadium)
    {
        return $stadium->load(['sport', 'images', 'reviews.user:id,name']);
    }

    public function update(Request $request, Stadium $stadium)
    {
        $data = $this->validated($request);
        $uploadedImages = $this->uploadedImages($request);
        $images = $data['images'] ?? null;
        $mainImageIndex = (int) ($data['main_image_index'] ?? 0);
        unset($data['images']);
        unset($data['main_image_index']);

        $stadium->update($data);

        if ($uploadedImages) {
            $this->deleteStoredImages($stadium);
            $stadium->images()->delete();
            $this->storeUploadedImages($stadium, $uploadedImages, $mainImageIndex);
        } elseif (is_array($images)) {
            $this->deleteStoredImages($stadium);
            $stadium->images()->delete();
            $this->syncImages($stadium, $images);
        }

        return $stadium->load(['sport', 'images']);
    }

    public function destroy(Stadium $stadium)
    {
        $images = $stadium->images()->get();

        try {
            $stadium->delete();
        } catch (QueryException $exception) {
            return response()->json([
                'message' => 'This stadium cannot be deleted because it is linked to reservations.',
            ], 422);
        }

        $this->deleteStoredImagePaths($images->pluck('image_path')->all());

        return response()->noContent();
    }

    private function validated(Request $request): array
    {
        if ($request->has('is_active')) {
            $booleanValue = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $request->merge(['is_active' => $booleanValue ?? $request->input('is_active')]);
        }

        $imageRules = $request->hasFile('images')
            ? ['images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120']]
            : [
                'images.*.image_path' => ['required_with:images', 'string', 'max:255'],
                'images.*.is_main' => ['nullable', 'boolean'],
            ];

        return $request->validate([
            'sport_id' => ['required', 'exists:sports,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'city' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'price_per_hour' => ['required', 'numeric', 'min:0'],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['required', 'boolean'],
            'images' => ['nullable', 'array'],
            'main_image_index' => ['nullable', 'integer', 'min:0'],
        ] + $imageRules);
    }

    private function syncImages(Stadium $stadium, array $images): void
    {
        foreach ($images as $image) {
            $stadium->images()->create([
                'image_path' => $image['image_path'],
                'is_main' => $image['is_main'] ?? false,
            ]);
        }
    }

    private function uploadedImages(Request $request): array
    {
        if (!$request->hasFile('images')) {
            return [];
        }

        $files = $request->file('images');

        return is_array($files) ? $files : [$files];
    }

    private function storeUploadedImages(Stadium $stadium, array $files, int $mainImageIndex): void
    {
        foreach ($files as $index => $file) {
            $path = $file->store("stadiums/{$stadium->id}", 'public');

            $stadium->images()->create([
                'image_path' => url(Storage::url($path)),
                'is_main' => $index === $mainImageIndex,
            ]);
        }
    }

    private function deleteStoredImages(Stadium $stadium): void
    {
        $this->deleteStoredImagePaths($stadium->images()->pluck('image_path')->all());
    }

    private function deleteStoredImagePaths(array $imagePaths): void
    {
        foreach ($imagePaths as $imagePath) {
            $path = parse_url($imagePath, PHP_URL_PATH) ?: $imagePath;

            if (!str_starts_with($path, '/storage/')) {
                continue;
            }

            Storage::disk('public')->delete(ltrim(substr($path, strlen('/storage/')), '/'));
        }
    }
}
