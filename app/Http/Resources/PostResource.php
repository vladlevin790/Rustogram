<?php

namespace App\Http\Resources;

use App\Models\MorePost;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $this->load('morePost');

        if ($this->morePost != null) {
            $imagePath = $this->morePost->pluck('image_path')->toArray();
            $videoPath = $this->morePost->pluck('video_path')->toArray();
        } else {
            $imagePath = [];
            $videoPath = [];
        }

        return [
            'id' => $this->id,
            'image_path' => $this->image_path,
            'more_image_path' => $imagePath,
            'video_path' => $this->video_path,
            'more_video_path' => $videoPath,
            'description' => $this->description,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->avatar,
            ],
            'comments' => $this->comments,
            'likes' => $this->likes->count(),
            'hashtags' => $this->hashtags,
        ];
    }
}
