<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Messages;
use App\Models\User;
use App\Models\Users_chats;
use App\Services\ChatsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    protected ChatsService $chats;

    public function __construct(ChatsService $chats){
        $this->chats = $chats;
    }
    public function searchUser($username)
    {
        return response()->json($this->chats->searchingUser($username));
    }

    public function getUserChats(Request $request)
    {
        return response()->json($this->chats->getPersonalChats($request));
    }

    public function createChat(Request $request, $userId)
    {
        return response()->json($this->chats->createChat($request,$userId));
    }


    public function getChatInfo(Request $request, $chatId)
    {
        return response()->json($this->chats->getChatInfo($request,$chatId));
    }

    public function getAllMessagesFromChat(Request $request, $chatId, $userId)
    {
        return response()->json($this->chats->getAllMessagesFromChat($request,$chatId,$userId));
    }


    public function deleteChat(Request $request, $chatId)
    {
        return response()->json($this->chats->deleteChat($request,$chatId));
    }

    public function sendMessage(Request $request, $chatId, $userId)
    {
        return response()->json($this->chats->sendMessage($request, $chatId, $userId));
    }

    public function deleteMessage(Request $request, $messageId)
    {
        return response()->json($this->chats->deleteMessage($request, $messageId));
    }

    public function editMessage(Request $request, $messageId)
    {
        return response()->json($this->chats->editMessage($request, $messageId));
    }

}
