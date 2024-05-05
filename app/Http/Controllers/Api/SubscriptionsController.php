<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriptions;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SubscriptionsController extends Controller
{
    public function subscribeUser($userId,$ownerId){
        try {
            $user = User::with('subscriptions')->FindOrFail($userId);
            $user->subscriptions()->create([
                'user_id' => $userId,
                'owner_id' => $ownerId,
            ]);
            return response()->json(['Success'=>true,'status'=>200]);
        } catch (\Exception $e) {
            return response()->json(['Success'=>false]);
        }
    }

    public function subscriptionInfo($userId){
        try {
            $user = User::findOrFail($userId);
            $subscriptions = Subscriptions::where('owner_id', $user->id)->get();
            $subscriptionsCount = $subscriptions->count();
            $subscriptionIds = $subscriptions->pluck('id');
            $userIds = $subscriptions->pluck('user_id');

            return response()->json([
                'Success' => true,
                'subscriptions' => $subscriptions,
                'subscriptions_count' => $subscriptionsCount,
                'subscription_ids' => $subscriptionIds,
                'user_ids' => $userIds,
                'status' => 200
            ]);
        } catch (\Exception $e) {
            return response()->json(['Success' => false]);
        }
    }


    public function getSubscribedUsers($userId) {
        try {
            $user = User::with('subscriptions')->FindOrFail($userId);
            $subscribedUserIds = $user->subscriptions->pluck('user_id');
            $subscribedUsers = User::whereIn('id', $subscribedUserIds)->get(['id', 'name']);
            return response()->json(['Success'=>true, 'subscribed_users' => $subscribedUsers, 'status'=>200]);
        } catch (\Exception $e) {
            return response()->json(['Success'=>false]);
        }
    }

    public function unSubscribe($userId, $subscrId) {
        try {
            $user = User::FindOrFail($userId);
            $subscription = Subscriptions::FindOrFail($subscrId);
            if ($subscription->user_id === $user->id) {
                $subscription->delete();
                return response()->json(['Success' => true, 'status' => 200]);
            } else {
                return response()->json(['Success' => false, 'message' => 'У пользователя нет такой подписки']);
            }
        } catch (\Exception $e) {
            return response()->json(['Success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function selectUsersFromSubscription($userId) {
        try {
            $user = User::findOrFail($userId);
            $subscribedUsers = User::whereHas('subscriptions', function($query) use ($userId) {
                $query->where('owner_id', $userId);
            })->get(['id', 'name', 'avatar']);
            return response()->json(['Success' => true, 'subscribed_users' => $subscribedUsers, 'status' => 200]);
        } catch (\Exception $e) {
            return response()->json(['Success' => false]);
        }
    }


}
