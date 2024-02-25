<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hashtag;
use App\Models\Posts;
use Illuminate\Http\Request;

class HashtagController extends Controller
{
    public function index()
    {
        $hashtags = Hashtag::all();
        return response()->json($hashtags);
    }

    public function show(Hashtag $hashtag)
    {
        $photos = $hashtag->photos;
        return response()->json($photos);
    }

    public function attach(Request $request)
    {
        $data = $request->validate([
            'photo_id' => 'required|integer',
            'hashtag_id' => 'required|integer',
        ]);

        $photo = Posts::findOrFail($data['photo_id']);
        $hashtag = Hashtag::findOrFail($data['hashtag_id']);

        $photo->hashtags()->attach($hashtag);

        return response()->json(['message' => 'Hashtag attached to photo'], 201);
    }

    public function detach(Request $request)
    {
        $data = $request->validate([
            'photo_id' => 'required|integer',
            'hashtag_id' => 'required|integer',
        ]);

        $photo = Posts::findOrFail($data['photo_id']);
        $hashtag = Hashtag::findOrFail($data['hashtag_id']);

        $photo->hashtags()->detach($hashtag);

        return response()->json(['message' => 'Hashtag detached from photo'], 204);
    }
}
