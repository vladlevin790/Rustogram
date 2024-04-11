<?php

use App\Http\Controllers\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/get_chats',[ChatController::class,'getUserChats']);
Route::delete('/delete_chat/{chatId}}',[ChatController::class,'deleteChat']);
Route::post('/send_message/{chatId}/{userId}',[ChatController::class,'sendMessage']);
Route::delete('/delete_message/{messageId}',[ChatController::class,'deleteMessage']);
Route::get('/get_chat/{chatId}',[ChatController::class,'getChatInfo']);
Route::get('/search_user/chat/{username}',[ChatController::class,'searchUser']);
Route::post('/search_user/create_chat/{userId}',[ChatController::class,'createChat']);
Route::get('/get_all_from_chat/{chatId}/{userId}',[ChatController::class,'getAllMessagesFromChat']);
