<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class StadiumImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'stadium_id',
        'path',
    ];

    public function stadium(): BelongsTo
    {
        return $this->belongsTo(Stadium::class);
    }
}
