<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reels extends Model
{
    use HasFactory;

    protected $fillable = [
        'video_path',
        'description',
        'user_id',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function comments() {
        return $this->hasMany(Reels_comment::class);
    }

    public function likes() {
        return $this->hasMany(Reels_like::class);
    }
}
