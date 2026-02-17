<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StadiumResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->name,
            'description' => $this->description,
            'price_per_hour' => $this->price_per_hour,
            'location' => $this->location,

            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(function ($img) {
                    return asset('storage/' . $img->path);
                });
            }),
        ];
    }
}
