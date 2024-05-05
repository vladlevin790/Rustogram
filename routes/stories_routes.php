<?php

use App\Http\Controllers\API\StoriesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/stories',[StoriesController::class,'index']);
Route::get('/stories/subscription/{userId}',[StoriesController::class,'selectSubscriptionStories']);
Route::get('/stories/looked/{userId}',[StoriesController::class,'lookedStory']);
Route::post('/stories/look/{userId}/{storyId}',[StoriesController::class,'lookStory']);
Route::post('/stories/create',[StoriesController::class,'createStory']);
Route::delete('/stories/delete/{storyId}',[StoriesController::class,'deleteStory']);
