<?php
use App\Http\Controllers\Api\PostCommentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/posts/{post}/comments', [PostCommentController::class, 'store']);
Route::get('/posts/{post}/comments', [PostCommentController::class, 'index']);
Route::put('/posts/{post}/comments/{comment}', [PostCommentController::class, 'update']);
Route::delete('/posts/{post}/comments/{comment}', [PostCommentController::class, 'destroy']);
