<?php
namespace App\Services;

use App\Models\MorePost;
use App\Models\Posts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class Post
{
    public function createPhoto(Request $request)
    {
        $user = Auth::user();
        $data = $request->validate([
            'image_path' => 'required|image|mimes:jpeg,png,jpg,gif',
            'video_path' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $imagePath = $request->file('image_path')->store('public/images');

        $data['image_path'] = url(\Storage::url($imagePath));

        $posts = $user->posts()->create($data);

        return $posts;
    }

    public function updatePost(Request $request, $postId)
    {
        $user = Auth::user();
        $post = Post::findOrFail($postId);

        if ($user->id !== $post->user_id) {
            abort(403, 'Вы не являетесь владельцем этого поста');
        }

        $data = $request->validate([
            'image_path' => 'nullable|string',
            'video_path' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $post->update($data);

        if ($request->has('image_path') || $request->has('video_path')) {
            $morePostData = [];
            if ($request->has('image_path')) {
                $morePostData['image_path'] = $data['image_path'];
            }
            if ($request->has('video_path')) {
                $morePostData['video_path'] = $data['video_path'];
            }
            $morePostData['post_id'] = $postId;
            MorePost::create($morePostData);
        }
        return $post;
    }


    public function deletePost($postId)
    {
        $user = Auth::user();
        $post = Posts::FindOrFail($postId);
        if ($user->id !== $post->user_id) {
            abort(403, 'Вы не являетесь владельцем этого поста и не можете его удалить');
        }
        $imagePath = str_replace('http://localhost:8000/storage/', 'public/', $post->image_path);
        Storage::delete($imagePath);
        MorePost::where('post_id', $postId)->delete();
        $post->delete();
        return null;
    }

}
