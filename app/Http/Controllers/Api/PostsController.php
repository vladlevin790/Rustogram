<?php
namespace App\Http\Controllers\Api;

use App\Services\Post;
use App\Http\Controllers\Controller;
use App\Models\Posts;
use Illuminate\Http\Request;

class PostsController extends Controller
{
    protected Post $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function index()
    {
        $posts = Posts::with('user', 'comments', 'likes', 'hashtags')->get();

        $formattedPosts = $posts->map(function ($post) {
            return [
                'id' => $post->id,
                'image_path' => $post->image_path,
                'video_path' => $post->video_path,
                'description' => $post->description,
                'created_at' => $post->created_at,
                'updated_at' => $post->updated_at,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'avatar' => $post->user->avatar,
                ],
                'comments' => $post->comments,
                'likes' => $post->likes->count(),
                'hashtags' => $post->hashtags,
            ];
        });

        return response()->json($formattedPosts);
    }

    public function create()
    {
    }

    public function store(Request $request)
    {
        $posts = $this->post->createPhoto($request);

        return response()->json($posts, 201);
    }

    public function show(Posts $posts)
    {
        return response()->json($posts);
    }

    public function edit(Posts $posts)
    {
    }

    public function update(Request $request, Posts $posts)
    {
        $posts = $this->post->updatePhoto($request, $posts);

        return response()->json($posts, 200);
    }

    public function destroy(Posts $posts)
    {
        $this->post->deletePhoto($posts);

        return response()->json(null, 204);
    }
}
