<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserSettingsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('/user_profile', UserController::class)->except(['index', 'show']);
Route::get('/user_profile',function (Request $request) {
    return $request->user();
});
Route::post('/user_profile/edit',[UserSettingsController::class,'updateUser']);

