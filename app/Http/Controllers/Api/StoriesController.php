<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoriesResource;
use App\Models\Stories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function createStory(Request $request){
        try {
            $user = Auth::user();
            $data = $request->validate([
                'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif',
                'video_path' => 'nullable|string',
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
            $story = $user->stories()->create($data);
            return response()->json(['Success'=>true,'status'=>200]);
        } catch (\Exception $e) {
            return response()->json(['Success'=>false]);
        }
    }

    public function deleteStory($storyId) {
        try {
            $user = Auth::user();
            $story = Stories::FindOrFail($storyId);
            $imagePath = str_replace('http://localhost:8000/storage/', 'public/', $story->image_path);
            $videoPath = str_replace('http://localhost:8000/storage/', 'public/', $story->video_path);
            Storage::delete($imagePath);
            Storage::delete($videoPath);
            $story->delete();
            return response()->json(['Success' => true, 'status' => 200);
        } catch (\Exception $e) {
            return response()->json(['Success' => false]);
        }
    }

}
