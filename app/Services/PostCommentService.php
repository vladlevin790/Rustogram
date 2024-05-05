<?php

namespace App\Services;

use App\Models\Posts;
use App\Models\PostsComments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostCommentService
{
    public function index()
    {
        try {
            $comments = PostsComments::with('user', 'post')->get();
            $formattedPosts = $comments->map(function ($comments) {
                return [
                    'id' => $comments->id,
                    'post_id' => $comments->post_id,
                    'content' => $comments->content,
                    'user' => [
                        'id' => $comments->user->id,
                        'name' => $comments->user->name,
                        'avatar' => $comments->user->avatar,
                    ],
                    'created_at' => $comments->created_at,
                ];
            });

            return $formattedPosts;
        } catch (\Exception $e) {
            return ['Success'=>false,'Message'=>'Error selecting comments'];
        }
    }

    public function createComment(Request $request)
    {
        try {
            $user = Auth::user();
            $data = $request->validate([
                'user_id' => 'required|integer',
                'post_id' => 'required|integer',
                'content' => 'required|string',
            ]);

            $photo = Posts::findOrFail($data['post_id']);

            $comment = $user->comments()->create($data);

            $photo->comments()->save($comment);

            return $comment;
        } catch (\Exception $e) {
            return ['Success'=>false, 'Message'=>'error creating with creating comment'];
        }
    }
}
