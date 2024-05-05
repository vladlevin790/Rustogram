<?php
namespace App\Http\Controllers\Api\Traits;

use App\Models\Posts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

trait PhotoTrait
{
//    public function createPhoto(Request $request)
//    {
//        $user = Auth::user();
//        $data = $request->validate([
//            'image_path' => 'required|image|mimes:jpeg,png,jpg,gif',
//            'video_path' => 'nullable|string',
//            'description' => 'nullable|string',
//        ]);
//
//        $imagePath = $request->file('image_path')->store('public/images');
//
//        $data['image_path'] = url(\Storage::url($imagePath));
//
//        $posts = $user->posts()->create($data);
//
//        return $posts;
//    }
//
//    public function updatePhoto(Request $request, $posts)
//    {
//        $this->authorize('update', $posts);
//
//        $data = $request->validate([
//            'image_path' => 'string',
//            'video_path' => 'nullable|string',
//            'description' => 'nullable|string',
//        ]);
//
//        $posts->update($data);
//
//        return $posts;
//    }
//
//    public function deletePhoto($posts)
//    {
//        $this->authorize('delete', $posts);
//
//        $posts->delete();
//
//        return null;
//    }
}
