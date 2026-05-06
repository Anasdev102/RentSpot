<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stadium_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('stadium_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('image_path');
            $table->boolean('is_main')->default(false);
            $table->timestamps();

            $table->index(['stadium_id', 'is_main']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stadium_images');
    }
};
