<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Users_chats extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'owner_id',
        'user_id',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function chat() {
        return $this->belongsTo(Chat::class,'chat_id');
    }
}
