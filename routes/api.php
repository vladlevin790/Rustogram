<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostsLikeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PostsController;
use App\Http\Controllers\Api\PostCommentController;
use App\Http\Controllers\Api\HashtagController;
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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user_main', function (Request $request) {
        return $request->user();
    });

    Route::post('/posts', [PostsController::class, 'store']);
    Route::get('/posts', [PostsController::class, 'index']);
    Route::get('/storage/images/{filename}', function ($filename) {
        $path = storage_path("app/public/images/{$filename}");

        if (!File::exists($path)) {
            abort(404);
        }

        return response()->file($path);
    })->where('filename', '.*');
    Route::apiResource('/user_profile', UserController::class)->except(['index', 'show']);
    Route::apiResource('/posts', PostsController::class)->except(['index']);
    Route::post('/posts/{post}/comments', [PostCommentController::class, 'store']);
    Route::get('/posts/{post}/comments', [PostCommentController::class, 'index']);
    Route::put('/posts/{post}/comments/{comment}', [PostCommentController::class, 'update']);
    Route::delete('/posts/{post}/comments/{comment}', [PostCommentController::class, 'destroy']);
    Route::get('/getLikes', [PostsLikeController::class, 'getLikes']);
    Route::post('/like', [PostsLikeController::class, 'likePost']);
    Route::post('/unlike', [PostsLikeController::class, 'unlikePost']);
    Route::apiResource('likes', PostsLikeController::class)->except(['index']);
    Route::apiResource('/hashtags', HashtagController::class)->except(['index']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

