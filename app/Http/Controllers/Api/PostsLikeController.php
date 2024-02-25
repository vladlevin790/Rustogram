<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PostsLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PostsLikeController extends Controller
{

    public function getLikes(Request $request)
    {
        $likes = PostsLike::with('user', 'post')->get();

        $likesData = $likes->map(function ($like) {
            return [
                'id' => $like->id,
                'user' => [
                    'id' => $like->user->id,
                    'name' => $like->user->name,
                ],
                'post' => [
                    'id' => $like->post->id,
                    'title' => $like->post->title,
                ],
                'created_at' => $like->created_at,
                'updated_at' => $like->updated_at,
            ];
        });

        return response()->json(['likes' => $likesData]);
    }


    public function likePost(Request $request)
    {
        $postId = $request->input('post_id');
        $userId = Auth::id();

        $like = PostsLike::where('user_id', $userId)->where('post_id', $postId)->first();

        if ($like) {
            Log::info("User $userId is trying to like post $postId");
            return response()->json(['message' => 'Post already liked'], 422);
        }

        $like = new PostsLike();
        $like->user_id = $userId;
        $like->post_id = $postId;
        $like->save();

        Log::info("User $userId liked post $postId successfully");

        return response()->json(['message' => 'Post liked successfully']);
    }

    public function unlikePost(Request $request)
    {
        $postId = $request->input('post_id');
        $userId = Auth::id();
        Log::info("User $userId is trying to unlike post $postId");

        $like = PostsLike::where('user_id', $userId)->where('post_id', $postId)->first();

        if (!$like) {
            return response()->json(['message' => 'Post not liked'], 422);
        }

        $like->delete();

        Log::info("User $userId unliked post $postId successfully");
        return response()->json(['message' => 'Post unliked successfully']);
    }
}
