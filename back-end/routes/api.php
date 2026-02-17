<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\StadiumController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/test', [Controller::class, 'test']);

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/stadiums', [StadiumController::class, 'index']);
    Route::get('/stadiums/{stadium}', [StadiumController::class, 'show']);

    Route::middleware('admin')->group(function () {
        Route::post('/stadiums', [StadiumController::class, 'store']);
        Route::put('/stadiums/{stadium}', [StadiumController::class, 'update']);
        Route::delete('/stadiums/{stadium}', [StadiumController::class, 'destroy']);
    });
});