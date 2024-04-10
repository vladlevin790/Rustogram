<?php

use App\Http\Controllers\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/get_chats',[ChatController::class,'getUserChats']);
Route::delete('/delete_chat/{chatId}}',[ChatController::class,'deleteChat']);
Route::post('/send_message/{chatId}}',[ChatController::class,'sendMessage']);
Route::delete('/delete_message/{messageId}',[ChatController::class,'deleteMessage']);
Route::get('/get_chat/{chatId}',[ChatController::class,'getChatInfo']);
Route::get('/search_user/chat/{username}',[ChatController::class,'searchUser']);
