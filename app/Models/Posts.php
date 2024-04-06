<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Posts extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'image_path', 'video_path', 'description'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(PostsComments::class,'post_id');
    }

    public function likes()
    {
        return $this->hasMany(PostsLike::class,'post_id');
    }

    public function hashtags()
    {
        return $this->hasMany(Hashtag::class,'post_id');
    }
    public function morePost()
    {
        return $this->hasMany(MorePost::class,'post_id');
    }
}
