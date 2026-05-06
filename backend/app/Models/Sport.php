<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sport extends Model
{
    use HasFactory;
    use HasUuids;

    protected $fillable = [
        'name',
        'icon',
    ];

    public function stadiums(): HasMany
    {
        return $this->hasMany(Stadium::class);
    }
}
