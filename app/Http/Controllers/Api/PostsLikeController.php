<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PostsLike;
use App\Services\LikeServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PostsLikeController extends Controller
{
    protected LikeServices $likeServices;

    public function __construct(LikeServices $likeServices) {
        $this->likeServices = $likeServices;
    }

    public function getLikes(Request $request)
    {
        return response()->json($this->likeServices->getLikes($request));
    }

    public function likePost(Request $request)
    {
        return response()->json($this->likeServices->likePost($request));
    }

    public function unlikePost(Request $request)
    {
        return response()->json($this->likeServices->likePost($request));
    }
}
