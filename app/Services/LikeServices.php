<?php

namespace App\Services;

use App\Models\PostsLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LikeServices
{
    public function getLikes($request)
    {
        try {
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

            return ['likes' => $likesData];
        } catch (\Exception $e) {
            return ['Success'=>false,'Message'=>'Error with getting likes'];
        }
    }

    public function likePost($request)
    {
        try {
            $postId = $request->input('post_id');
            $userId = Auth::id();

            $like = PostsLike::where('user_id', $userId)->where('post_id', $postId)->first();

            if ($like) {
                return response()->json(['message' => 'PostService already liked'], 422);
            }

            $like = new PostsLike();
            $like->user_id = $userId;
            $like->post_id = $postId;
            $like->save();

            return ['message' => 'PostService liked successfully'];
        } catch (\Exception $e) {
            return ['Success'=>false,'Message'=>'Error liking post'];
        }
    }

    public function unlikePost( $request)
    {
        try {
            $postId = $request->input('post_id');
            $userId = Auth::id();

            $like = PostsLike::where('user_id', $userId)->where('post_id', $postId)->first();

            if (!$like) {
                return response()->json(['message' => 'PostService not liked'], 422);
            }

            $like->delete();

            return response()->json(['message' => 'PostService unliked successfully']);
        } catch (\Exception $e) {
            return ['Success'=>false,'Message'=>'Error unLiking post'];
        }
    }
}
