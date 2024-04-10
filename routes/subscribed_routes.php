<?php

use App\Http\Controllers\Api\SubscriptionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/subscription_info/{userId}',[SubscriptionsController::class,'subscriptionInfo']);
Route::post('/subscribe_user/{userId}/{ownerId}',[SubscriptionsController::class,'subscribeUser']);
Route::get('/get_subscribed_users/{userId}',[SubscriptionsController::class,'getSubscribedUsers']);
Route::get('/get_subscribed_users/{userId}',[SubscriptionsController::class,'selectUsersFromSubscription']);
Route::delete('/delete_subscription/{userId}/{subscrId}',[SubscriptionsController::class,'unSubscribe']);
