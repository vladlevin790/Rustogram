<?php
namespace App\Services;

use App\Models\Chat;

class Chats
{
    public function getChat($userId) {
        $chat = Chat::with('')->where('user_id', $userId)->get();
    }
}
