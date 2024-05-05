<?php

use App\Http\Controllers\Api\PostCommentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostsController;

Route::get('/posts/search/{username}',[PostsController::class,'searchPost']);
Route::post('/posts', [PostsController::class, 'store']);
Route::get('/posts', [PostsController::class, 'index']);
Route::get('/posts/subscription/{userId}',[PostsController::class,'subscriptionIndex']);
Route::get('/storage/images/{filename}', function ($filename) {
    $path = storage_path("app/public/images/{$filename}");
    if (!File::exists($path)) {
        abort(404);
    }
    return response()->file($path);
})->where('filename', '.*');
Route::apiResource('/posts', PostsController::class)->except(['index']);
require __DIR__.'/comments_routes.php';
Route::get('/posts/select_post/{postId}',[PostsController::class,'getPost']);
Route::delete('/posts/{postId}', [PostsController::class, 'destroy']);
Route::put('/posts/{postId}/{bioRef}', [PostsController::class, 'updatePostDescription']);
Route::post('/posts/{postId}/add_image', [PostsController::class, 'addImage']);

