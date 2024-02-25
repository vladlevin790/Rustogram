<?php

namespace App\Services;

use App\Models\Posts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostCommentService
{
    public function createComment(Request $request)
    {
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
    }

    public function updateComment(Request $request, $comment)
    {

        $data = $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update($data);

        return $comment;
    }

    public function deleteComment($comment)
    {

        $comment->delete();

        return null;
    }
}
