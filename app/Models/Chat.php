<?php

namespace App\Models;

use http\Message;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $table = 'chat';

    protected $fillable = [
        'name'
    ];

    public function userChat() {
        return $this->hasOne(Users_chats::class,'chat_id');
    }

    public function messagesChat() {
        return $this->hasMany(Message::class,'chat_id');
    }
}
