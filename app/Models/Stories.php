<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stories extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'image_path',
        'video_path',
        'description',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
