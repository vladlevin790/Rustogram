<?php
namespace App\Services;

use App\Http\Resources\PostResource;
use App\Models\MorePost;
use App\Models\Posts;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class Post
{
    public function selectSubscrPost($userId){
        $user = User::with('subscriptions')->findOrFail($userId);
        $subscribedUserIds = $user->subscriptions->pluck('owner_id')->toArray();
        $subscribedUserIds[] = $user->id;
        $posts = Posts::with('user', 'comments', 'likes', 'hashtags', 'morePost')
            ->whereIn('user_id', $subscribedUserIds)
            ->get();
        foreach ($posts as $post) {
            $post->load('morePost');
            $post->load('user');
            $post->load('comments');
            $post->load('likes');
            $post->load('hashtags');
        }
        return PostResource::collection($posts);
    }
    public function selectAllPost(){
        $posts = Posts::with('user', 'comments', 'likes', 'hashtags', 'morePost')->get();
        foreach ($posts as $post) {
            $post->load('morePost');
            $post->load('user');
            $post->load('comments');
            $post->load('likes');
            $post->load('hashtags');
        }
        return PostResource::collection($posts);
    }

    public function createPost(Request $request)
    {
        $user = Auth::user();
        $data = $request->validate([
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'video_path' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        if ($request->hasFile('image_path')) {
            $imagePath = $request->file('image_path')->store('public/images');
            $data['image_path'] = url(\Storage::url($imagePath));
        }
        if ($request->hasFile('video_path')) {
            $videoPath = $request->file('video_path')->store('public/images');
            $data['video_path'] = url(\Storage::url($videoPath));
        }
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
        $post->comments()->delete();
        $post->likes()->delete();
        $post->hashtags()->delete();
        $imagePath = str_replace('http://localhost:8000/storage/', 'public/', $post->image_path);
        $videoPath = str_replace('http://localhost:8000/storage/', 'public/', $post->video_path);
        Storage::delete($imagePath);
        Storage::delete($videoPath);
        $morePost = MorePost::where('post_id', $postId)->get();
        foreach ($morePost as $more) {
            $moreImagePath = str_replace('http://localhost:8000/storage/', 'public/', $more->image_path);
            $moreVideoPath = str_replace('http://localhost:8000/','public/', $more->video_path);
            Storage::delete($moreImagePath);
            Storage::delete($moreVideoPath);
            $more->delete();
        }
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

    public function getOnePost($postID) {
        $post = Posts::with('morePost')->findOrFail($postID);
        return new PostResource($post);
    }

    public function getAnotherUserPosts($userID) {
        $posts = Posts::where('user_id',$userID)->with('morePost')->get();
        foreach ($posts as $post) {
            $post->load('morePost');
        }
        return PostResource::collection($posts);
    }


}
