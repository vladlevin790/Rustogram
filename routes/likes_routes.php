<?php
use App\Http\Controllers\Api\PostsLikeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/getLikes', [PostsLikeController::class, 'getLikes']);
Route::post('/like', [PostsLikeController::class, 'likePost']);
Route::post('/unlike', [PostsLikeController::class, 'unlikePost']);
Route::apiResource('likes', PostsLikeController::class)->except(['index']);
