<?php
namespace App\Http\Controllers\Api;

use App\Models\MorePost;
use App\Models\User;
use App\Services\PostService;
use App\Http\Controllers\Controller;
use App\Models\Posts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PostsController extends Controller
{
    protected PostService $post;

    public function __construct(PostService $post)
    {
        $this->post = $post;
    }

    public function index()
    {
        $formattedPosts = $this->post->selectAllPost();
        return response()->json($formattedPosts);
    }

    public function subscriptionIndex($userId)
    {
        $formattedPosts = $this->post->selectSubscrPost($userId);
        return response()->json($formattedPosts);
    }

    public function store(Request $request)
    {
        $posts = $this->post->createPost($request);
        return response()->json($posts, 201);
    }

    public function show(Posts $posts)
    {
        return response()->json($posts);
    }

    public function destroy($posts)
    {
        $this->post->deletePost($posts);
        return response()->json(null, 204);
    }

    public function updatePostDescription($postId,$bioRef)
    {
        $this->post->updateDescription($postId,$bioRef);
        return response()->json(['Success' => true,'status' => 200]);
    }

    public function addImage($postId,Request $request){
        $this->post->addAnotherPostImageOrVideo($postId,$request);
        return response()->json(['Success'=>true,'status'=>200]);
    }

    public function getPost($postID) {
        return response()->json($this->post->getOnePost($postID));
    }

    public function getAnotherUserPost($userID) {
        return response()->json($this->post->getAnotherUserPosts($userID));
    }

    public function searchPost($username)
    {
        return response()->json($this->post->searchPost($username));
    }
}
