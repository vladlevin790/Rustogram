<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HashtagController;
use App\Http\Controllers\Api\PostsController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\UserSignUpUpdateController;
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
    Route::post('/signup/finish', [UserSignUpUpdateController::class, 'insertSignUpUserInfo']);
    require __DIR__ . '/posts_routes.php';
    require __DIR__.'/likes_routes.php';
    require __DIR__ . '/user_profile_routes.php';
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user_main', function (Request $request) {
        return $request->user();
    });
    Route::apiResource('/hashtags', HashtagController::class)->except(['index']);
});
Route::get('/user_profile/another_user/{userid}',[UserController::class,'getAnotherUser']);
Route::get('/posts/another_user/{userId}', [PostsController::class, 'getAnotherUserPost']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

