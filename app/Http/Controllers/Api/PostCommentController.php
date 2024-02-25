<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PostsComments;
use App\Services\PostCommentService;
use Illuminate\Http\Request;

class PostCommentController extends Controller
{
    protected PostCommentService $postCommentService;

    public function __construct(PostCommentService $postCommentService)
    {
        $this->postCommentService = $postCommentService;
    }

    public function index()
    {
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

        return response()->json($formattedPosts);
    }

    public function store(Request $request)
    {
        $comment = $this->postCommentService->createComment($request);

        return response()->json($comment, 201);
    }

    public function show(PostsComments $comment)
    {

        return response()->json($comment);
    }

    public function update(Request $request, PostsComments $comment)
    {

        $comment = $this->postCommentService->updateComment($request, $comment);

        return response()->json($comment, 200);
    }

    public function destroy(PostsComments $comment)
    {

        $this->postCommentService->deleteComment($comment);

        return response()->json(null, 204);
    }
}
