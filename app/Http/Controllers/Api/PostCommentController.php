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
        return response()->json($this->postCommentService->index());
    }

    public function store(Request $request)
    {
        $comment = $this->postCommentService->createComment($request);

        return response()->json($comment, 201);
    }
}
