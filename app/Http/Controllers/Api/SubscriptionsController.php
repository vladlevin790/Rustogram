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
            $user = User::FindOrFail($userId);
            $subscriptionUser = Subscriptions::where('owner_id',$user->id)->get('user_id');
            $subscriptionsCount = Subscriptions::where('owner_id',$user->id)->count();
            Log::info('Subscriptions count',['wdqwdq'=>$subscriptionUser]);
            return response()->json(['Success'=>true, 'subscriptions_count' => $subscriptionsCount, 'user_id'=>$subscriptionUser ,'status'=>200]);
        } catch (\Exception $e) {
            return response()->json(['Success'=>false]);
        }
    }


    public function getSubscribedUsers($userId) {
        try {
            $user = User::with('subscriptions')->findOrFail($userId);
            $subscribedUserIds = $user->subscriptions->pluck('user_id');
            $subscribedUsers = User::whereIn('id', $subscribedUserIds)->get(['id', 'name']);
            return response()->json(['Success'=>true, 'subscribed_users' => $subscribedUsers, 'status'=>200]);
        } catch (\Exception $e) {
            return response()->json(['Success'=>false]);
        }
    }

    public function unSubscribe($subscribeId) {
        try {
            $subscription = Subscriptions::FindOrFail($subscribeId);
            $subscription->delete();
            return response()->json(['Success'=>true, 'status'=>200]);
        } catch (\Exception $e) {
            return response()->json(['Success'=>false]);
        }
    }
}
