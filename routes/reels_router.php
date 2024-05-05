<?php

use App\Http\Controllers\Api\ReelsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/get_shorts',[ReelsController::class,'getShorts']);
Route::post('/create_shorts',[ReelsController::class,'createShorts']);
Route::delete('/delete_shorts/{shortsId}',[ReelsController::class,'deleteShorts']);
Route::get('/get_shorts_likes',[ReelsController::class,'getLikes']);
Route::post('/like_shorts',[ReelsController::class,'likeReels']);
Route::post('/unlike_shorts',[ReelsController::class,'unlikeReels']);
Route::post('/reels/{reels}/comments', [ReelsController::class, 'createComment']);
Route::get('/reels/{reels}/comments', [ReelsController::class, 'index']);
