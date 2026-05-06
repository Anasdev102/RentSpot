<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stadiums', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('sport_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('city');
            $table->string('address')->nullable();
            $table->decimal('price_per_hour', 8, 2);
            $table->unsignedInteger('capacity')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['sport_id', 'city', 'is_active']);
            $table->index('price_per_hour');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stadiums');
    }
};
