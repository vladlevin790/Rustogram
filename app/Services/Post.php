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

    public function selectAllPost(){
        $posts = Posts::with('user', 'comments', 'likes', 'hashtags')->get();

        $formattedPosts = $posts->map(function ($post) {
            $morePost = MorePost::where('post_id', $post->id);
            $imagePath = $morePost->pluck('image_path')->toArray();
            $videoPath = $morePost->pluck('video_path')->toArray();
            if ($morePost){
                return [
                    'id' => $post->id,
                    'image_path' => $post->image_path,
                    'more_image_path' => $imagePath,
                    'video_path' => $post->video_path,
                    'more_video_path' => $videoPath,
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
            } else {
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
            }
        });

        return $formattedPosts;
    }

    public function createPost(Request $request)
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

    public function updateDescription($postId, $bioRef) {
        $user = Auth::user();
        $post = Posts::FindOrFail($postId);
        if ($user->id !== $post->user_id) {
            abort(403, 'Вы не являетесь владельцем этого поста и не можете его удалить');
        }
        $post->update(['description'=>$bioRef]);
        return $post;
    }

    public function addAnotherPostImageOrVideo($postId,Request $request){
        $user = Auth::user();
        $post = Posts::FindOrFail($postId);
        if ($user->id !== $post->user_id) {
            abort(403, 'Вы не являетесь владельцем этого поста и не можете его удалить');
        }
        $data = $request->validate([
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'video_path' => 'nullable|string',
        ]);
        if ($request->hasFile('image_path')) {
            $imagePath = $request->file('image_path')->store('public/images');
            $data['image_path'] = url(\Storage::url($imagePath));
            $morePost = new MorePost();
            $morePost->create([
                'image_path' => $data['image_path'],
                'video_path' => null,
                'post_id' => $postId,
            ]);
        }
        if ($request->hasFile('video_path')) {
            $videoPath = $request->file('avatar')->store('public/videos');
            $data['video_path'] = url(\Storage::url($videoPath));
            $morePost = new MorePost();
            $morePost->create([
                'image_path'=>null,
                'video_path'=>$data['video_path'],
                'post_id'=>$postId,
            ]);
        }
    }

}
