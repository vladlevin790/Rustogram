<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\Messages;
use App\Models\Users_chats;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function getUserChats(Request $request)
    {
        $user = $request->user();
        $ownerChats = Users_chats::where('owner_id', $user->id)->with('chat')->get();
        $participantChats = Users_chats::where('user_id', $user->id)->with('chat')->get();
        $chats = $ownerChats->merge($participantChats);
        foreach ($chats as $chat) {
            if ($chat->owner_id == $user->id) {
                $secondUser = User::findOrFail($chat->user_id);
            } else {
                $secondUser = User::findOrFail($chat->owner_id);
            }
            $chat->second_user = $secondUser;
        }
        return response()->json($chats);
    }

    public function searchUser($username)
    {
        $user = User::where('name', 'like', '%' . $username . '%')->first();
        Log::info('User',['username' =>$user]);
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function createChat(Request $request, $userId)
    {
        $user = $request->user();
        $secondUser = User::FindOrFail($userId);

        if (!$secondUser) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $existingChat = Users_chats::where(function ($query) use ($user, $secondUser) {
            $query->where('owner_id', $user->id)
                ->where('user_id', $secondUser->id);
        })->orWhere(function ($query) use ($user, $secondUser) {
            $query->where('owner_id', $secondUser->id)
                ->where('user_id', $user->id);
        })->first();

        if ($existingChat) {
            return response()->json(['error' => 'Chat already exists'], 400);
        }

        $chat = new Chat();
        $chat->name = 'Chat between ' . $user->name . ' and ' . $secondUser->name;
        $chat->save();

        $userChat = new Users_chats();
        $userChat->chat_id = $chat->id;
        $userChat->owner_id = $user->id;
        $userChat->user_id = $secondUser->id;
        $userChat->save();

        return response()->json($chat);
    }


    public function deleteChat(Request $request, $chatId)
    {
        $user = $request->user();
        $chat = $user->userChats()->where('chat_id', $chatId)->first();
        if ($chat) {
            $chat->delete();
            return response()->json(['message' => 'Chat deleted successfully']);
        }
        return response()->json(['error' => 'Chat not found'], 404);
    }

    public function sendMessage(Request $request, $chatId, $userId)
    {
        $user = $request->user();
        $chat = Chat::FindOrFail($chatId);
        $secondUser = User::findOrFail($userId);
        if (!$chat) {
            return response()->json(['error' => 'Chat not found'], 404);
        }
//
//        if (!$user->userChats()->where('chat_id', $chatId)->exists()) {
//            return response()->json(['error' => 'Unauthorized'], 401);
//        }

        $message = new Messages();
        $message->chat_id = $chatId;
        $message->owner_id = $user->id;
        $message->user_id = $secondUser->id;
        $message->message = $request->input('message');
        $message->save();

        return response()->json($message);
    }

    public function deleteMessage(Request $request, $messageId)
    {
        $user = $request->user();
        $message = Messages::find($messageId);
        if (!$message) {
            return response()->json(['error' => 'Message not found'], 404);
        }

        if ($message->owner_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $message->delete();
        return response()->json(['message' => 'Message deleted successfully']);
    }

    public function getChatInfo(Request $request, $chatId)
    {
        $user = $request->user();
        $chat = Chat::with('messagesChat', 'userChat')->find($chatId);
        if (!$chat) {
            return response()->json(['error' => 'Chat not found'], 404);
        }

        if (!$user->userChats()->where('chat_id', $chatId)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json($chat);
    }

    public function getAllMessagesFromChat(Request $request, $chatId, $userId)
    {
        $user = $request->user();
        $secondUser = User::findOrFail($userId);

        $userChat = Users_chats::where(function ($query) use ($user, $secondUser) {
            $query->where('owner_id', $user->id)
                ->where('user_id', $secondUser->id);
        })->orWhere(function ($query) use ($user, $secondUser) {
            $query->where('owner_id', $secondUser->id)
                ->where('user_id', $user->id);
        })->where('chat_id', $chatId)
            ->first();

        if (!$userChat) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $messages = Messages::where('chat_id', $chatId)->get();

        return response()->json($messages);
    }


}
