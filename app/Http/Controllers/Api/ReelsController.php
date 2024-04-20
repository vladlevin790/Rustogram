<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reels;
use App\Models\Reels_comment;
use App\Models\Reels_like;
use Cassandra\Exception\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ReelsController extends Controller
{
    public function createShorts(Request $request)
    {
        try {
            $user = Auth::user();
            $data = $request->validate([
                'video_path' => 'required|file|mimes:mp4',
                'description' => 'nullable|string',
            ]);
            if ($request->hasFile('video_path')) {
                $videoPath = $request->file('video_path')->store('public/videos');
                $data['video_path'] = url(\Storage::url($videoPath));
            }
            $reel = $user->reels()->create($data);
            return $reel;
        } catch (ValidationException $e) {
            Log::error('Validation failed: '.$e->getMessage());
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating reels: '.$e->getMessage());
            return response()->json(['Success'=>false,'Message'=>'Error creating reels'], 500);
        }
    }


    public function getShorts(){
        try {
            $reels = Reels::with('user')->get();
            foreach ($reels as $video) {
                $video->load('user');
            }
            return response()->json($reels);
        } catch (\Exception $e) {
            Log::error('Error getting shorts: '.$e->getMessage());
            return response()->json(['Success'=>false,'Message'=>'Error getting reels'], 500);
        }
    }

    public function deleteShorts(Request $request,$shortsId) {
        try {
            $user = $request->user();
            $reels = Reels::FindOrFail($shortsId);
            if($user->is_admin == 1  || $reels->user_id == $user->id) {
                $videoPath = str_replace('http://localhost:8000/storage/', 'public/', $reels->video_path);
                Storage::delete($videoPath);
                $reels->comments()->delete();
                $reels->likes()->delete();
                $reels->delete();
            }
            return response()->json(['Success' => true, 'Message'=>'deleted']);
        } catch (\Exception $e) {
            return response()->json(['Success'=>false,'Message'=>'Error deleting shorts'], 500);
        }
    }

    public function getLikes(Request $request) {
        try {
            $likes = Reels_like::with('user','reels')->get();
            $likesData = $likes->map(function ($like) {
                return [
                    'id' => $like->id,
                    'user' => [
                        'id' => $like->user->id,
                        'name' => $like->user->name,
                    ],
                    'reels' => [
                        'id' => $like->reels->id,
                        'description' => $like->reels->description,
                    ],
                    'created_at' => $like->created_at,
                    'updated_at' => $like->updated_at,
                ];
            });
            return response()->json(['likes' => $likesData]);
        } catch (\Exception $e) {
            return response()->json(['Success'=>false,'Message'=>'Error getting likes'], 500);
        }
    }

    public function likeReels(Request $request) {
        try {
            $reelsId = $request->input('reels_id');
            $userId = Auth::id();
            $like = Reels_like::where('user_id', $userId)->where('reels_id', $reelsId)->first();
            if ($like) {
                return response()->json(['message' => 'already liked'], 422);
            }
            $like = new Reels_like();
            $like->user_id = $userId;
            $like->reels_id = $reelsId;
            $like->save();
            return ['message' => 'liked successfully'];
        } catch (\Exception $e) {
            return response()->json(['Success'=>false,'Message'=>'Error liking reels'], 500);
        }
    }

    public function unlikeReels(Request $request) {
        try {
            $reelsId = $request->input('reels_id');
            $userId = Auth::id();
            $like = Reels_like::where('user_id',$userId)->where('reels_id',$reelsId)->first();
            if(!$like) {
                return response()->json(['message' => 'not liked'], 422);
            }
            $like->delete();
            return response()->json(['message' => 'unliked successfully']);
        } catch (\Exception $e) {
            return response()->json(['Success'=>false,'Message'=>'Error unliking']);
        }
    }

    public function index($reels)
    {
        try {
            $comments = Reels_comment::with('user', 'reels')->where('reels_id',$reels)->get();
            $formattedReels = $comments->map(function ($comments) {
                return [
                    'id' => $comments->id,
                    'reels_id' => $comments->reels_id,
                    'content' => $comments->content,
                    'user' => [
                        'id' => $comments->user->id,
                        'name' => $comments->user->name,
                        'avatar' => $comments->user->avatar,
                    ],
                    'created_at' => $comments->created_at,
                ];
            });

            return response()->json($formattedReels);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return ['Success'=>false,'Message'=>'Error selecting comments'];
        }
    }

    public function createComment(Request $request, $reels)
    {
        try {
            $user = Auth::user();
            $data = $request->validate([
                'user_id' => 'required|integer',
                'reels_id' => 'required|integer',
                'content' => 'required|string',
            ]);

            $reels = Reels::findOrFail($reels);
            $comment = $user->reelsComment()->create($data);
            $reels->comments()->save($comment);

            return response()->json($comment);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return ['Success'=>false, 'Message'=>'error creating with creating comment'];
        }
    }
}
