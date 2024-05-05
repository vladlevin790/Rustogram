<?php
namespace App\Services;

use App\Models\Chat;
use App\Models\Messages;
use App\Models\User;
use App\Models\Users_chats;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatsService
{
    public function getPersonalChats($request)
    {
        try {
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
            return $chats;
        } catch (\Exception $e) {
            return ['Success'=>false,'Message'=>'Error with getting chat'];
        }
    }

    public function searchingUser($username)
    {
        try {
            $user = User::where('name', 'like', '%' . $username . '%')->first();
            if ($user) {
                return $user;
            } else {
                return ['Success'=>false, 'Message'=>'User not found'];
            }
        } catch (\Exception $e) {
            return ['Success'=>false, 'Message'=>'Error with searching'];
        }
    }

    public function createChat($request, $userId)
    {
        try {
            $user = $request->user();
            $secondUser = User::FindOrFail($userId);
            if (!$secondUser) {
                return response()->json(['error' => 'User not found'], 404);
            }
            if (!$user) {
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
            return $chat;
        } catch (\Exception $e) {
            return ['Success'=>false,'Message'=>'Error with creating chat'];
        }
    }

    public function getChatInfo($request, $chatId)
    {
        try {
            $user = $request->user();
            $chat = Chat::with('messagesChat', 'userChat')->find($chatId);
            if (!$chat) {
                return response()->json(['error' => 'Chat not found'], 404);
            }

            if (!$user->userChats()->where('chat_id', $chatId)->exists()) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            return $chat;
        } catch (\Exception $e) {
            return ['Success'=>false,'Message'=>'Error with getting chat information'];
        }
    }

    public function getAllMessagesFromChat($request, $chatId, $userId)
    {
        try {
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
                return response()->json(['error' => 'Not Found'], 404);
            }
            if(!$user) {
                return response()->json(['error' => 'Unauthorized'],401);
            }
            if(!$secondUser) {
                return response()->json(['error' => 'Unauthorized'],401);
            }
            $messages = Messages::where('chat_id', $chatId)->get();
            return $messages;
        } catch (\Exception $e) {
            return ['Success'=>false, 'Message'=>'Error with gitting all messages from this chat'];
        }
    }

    public function deleteChat($request, $chatId)
    {
        try {
            $user = $request->user();
            $userChat = Users_chats::with('chat')->where('owner_id', $user->id)->where('chat_id', $chatId)->orWhere('user_id', $user->id)->delete();
            $messages = Messages::where('chat_id', $chatId)->delete();
            return ['Success' => true];
        } catch (\Exception $e) {
            return ['Success'=>false,'Message' => 'Error deleting chat'];
        }
    }
    public function sendMessage($request, $chatId, $userId)
    {
        try {
            $user = $request->user();
            $chat = Chat::FindOrFail($chatId);
            $secondUser = User::findOrFail($userId);

            if (!$chat) {
                return response()->json(['error' => 'Chat not found'], 404);
            }

            $message = new Messages();
            $message->chat_id = $chatId;
            $message->owner_id = $user->id;
            $message->user_id = $secondUser->id;
            $message->message = $request->input('message');
            $message->save();
            return $message;
        } catch (\Exception $e) {
            return ['Success'=>false,'Message'=>'Error with sending message'];
        }
    }

    public function deleteMessage($request, $messageId)
    {
        try {
            $user = $request->user();
            $message = Messages::find($messageId);
            if (!$message) {
                return response()->json(['error' => 'Message not found'], 404);
            }

            if ($message->owner_id !== $user->id) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $message->delete();
            return ['message' => 'Message deleted successfully'];
        } catch (\Exception $e) {
            return ['Success' => false, 'Message' => 'Error deleting message'];
        }
    }

    public function editMessage($request, $messageId)
    {
        try {
            $user = $request->user();
            $message = Messages::find($messageId);

            if (!$message) {
                return response()->json(['error' => 'Message not found'], 404);
            }

            if ($message->owner_id !== $user->id) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $message->message = $request->input('message');
            $message->save();

            return $message;
        } catch (\Exception $e) {
            return ['Success' => false, 'Message'=>'Error with editing message'];
        }
    }
}
