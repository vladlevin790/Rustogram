<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MorePost extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'image_path',
        'video_path',
        'post_id',
    ];

    public function post() {
        return $this->belongsTo(Posts::class,'post_id');
    }
}
