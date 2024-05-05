<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Looked_stories extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'story_id',
        'is_looked',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function stories() {
        return $this->belongsTo(Stories::class, 'story_id');
    }
}
