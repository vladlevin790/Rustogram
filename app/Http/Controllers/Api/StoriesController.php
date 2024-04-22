<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoriesResource;
use App\Models\Looked_stories;
use App\Models\Stories;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class StoriesController extends Controller
{
    public function index(){
        try {
            $stories = Stories::with('user')->get();
            foreach ($stories as $story){
                $story->load('user');
            }
            return response()->json(StoriesResource::collection($stories));
        } catch (\Exception $e) {
            return response()->json(['Failure' => 'Could not load']);
        }
    }

    public function selectSubscriptionStories($userId){
        try {
            $user = User::with('subscriptions')->findOrFail($userId);
            $subscribedUserIds = $user->subscriptions->pluck('owner_id')->toArray();
            $subscribedUserIds[] = $user->id;
            $stories = Stories::with('user')
                ->whereIn('user_id', $subscribedUserIds)
                ->get();
            foreach ($stories as $story){
                $story->load('user');
            }
            return response()->json(StoriesResource::collection($stories));
        } catch (\Exception $e){
            return response()->json(['Failure' => 'Could not load']);
        }

    }

    public function lookedStory($userId) {
        try {
            $user = User::with('lookedStories')->FindOrFail($userId);
            $lookedStory = $user->lookedStories->pluck('story_id')->toArray();
            return response()->json([
                'looked_stories'=>$lookedStory,
            ]);
        } catch (\Exception $e){
            return response()->json(['Success'=>false]);
        }
    }

    public function lookStory($userId, $storyId) {
        try {
            $user =  User::with('lookedStories')->FindOrFail($userId);
            $user->lookedStories()->create([
                'user_id'=>$userId,
                'story_id'=>$storyId,
                'is_looked'=>true,
            ]);
            return response()->json(['Success'=>true,'status'=>200]);
        } catch (\Exception $e){
            return response()->json(['Success'=>false]);
        }
    }

    public function createStory(Request $request){
        try {
            Log::info($request);
            $user = Auth::user();
            $data = $request->validate([
                'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif',
                'video_path' => 'nullable|string', // TODO:сделать как в рилсах
                'description' => 'nullable|string',
            ]);
            if ($request->hasFile('image_path')) {
                $imagePath = $request->file('image_path')->store('public/images');
                $data['image_path'] = url(\Storage::url($imagePath));
            }
            if ($request->hasFile('video_path')) {
                $videoPath = $request->file('video_path')->store('public/images');
                $data['video_path'] = url(\Storage::url($videoPath));
            }
            $user->stories()->create($data);
            return response()->json(['Success'=>true,'status'=>200]);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return response()->json(['Success'=>false]);
        }
    }

    public function deleteStory(Request $request,$storyId) {
        try {
            $user = $request->user();
            $story = Stories::FindOrFail($storyId);
            if($user->is_admin == 1 || $story->user_id == $user->id) {
                Looked_stories::where('story_id', $storyId)->delete();
                if($story->image_path != null) {
                    $imagePath = str_replace('http://localhost:8000/storage/', 'public/', $story->image_path);
                    Storage::delete($imagePath);
                }
                if($story->image_path != null) {
                    $videoPath = str_replace('http://localhost:8000/storage/', 'public/', $story->video_path);
                    Storage::delete($videoPath);
                }
                $story->delete();
            }
            return response()->json(['Success' => true, 'status' => 200]);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return response()->json(['Success' => false]);
        }
    }

}
