<?php
namespace App\Http\Controllers\Api\Traits;

use App\Models\Posts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

trait CommentTrait
{
    public function createComment(Request $request)
    {
        $user = Auth::user();
        $data = $request->validate([
            'photo_id' => 'required|integer',
            'content' => 'required|string',
        ]);

        $photo = Posts::findOrFail($data['photo_id']);

        $comment = $user->comments()->create($data);

        $photo->comments()->save($comment);

        return $comment;
    }

    public function updateComment(Request $request, $comment)
    {
        $this->authorize('update', $comment);

        $data = $request->validate([
            'content' => 'string',
        ]);

        $comment->update($data);

        return $comment;
    }

    public function deleteComment($comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return null;
    }
}
