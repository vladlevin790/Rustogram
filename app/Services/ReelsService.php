<?php

namespace app\Services;

use Illuminate\Http\Request;

class ReelsService
{
    public function createShorts(Request $request) {
        $data = $request->validate([
            'video_path'=>'required|video|mimes:mp4,hevc',
            'description'=>'nullable|string',
        ]);
        $user = $request->user();
        if ($request->hasFile('video_path')) {
            $videoPath = $request->file('video_path')->store('public/videos');
            $data['video_path'] = url(\Storage::url($videoPath));
        }
        $user->reels()->create($data);
        return response()->json($data);
    }
}
