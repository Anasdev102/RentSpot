<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stadium_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stadium_id')
                ->constrained('stadiums')
                ->onDelete('cascade');

            $table->string('path'); // example: stadiums/img1.jpg
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stadium_images');
    }
};
