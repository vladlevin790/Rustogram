<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'bio',
        'is_online',
        'last_online',
        'gender',
        'birthday',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function posts()
    {
        return $this->hasMany(Posts::class);
    }

    public function comments()
    {
        return $this->hasMany(PostsComments::class);
    }

    public function stories() {
        return $this->hasMany(Stories::class);
    }

    public function subscriptions(){
        return $this->hasMany(Subscriptions::class);
    }

    public function lookedStories() {
        return $this->hasMany(Looked_stories::class);
    }

    public function messagesChat() {
        return $this->hasMany(Messages::class);
    }

    public function userChats(){
        return $this->hasMany(Users_chats::class);
    }

    public function reels(){
        return $this->hasMany(Reels::class,'user_id');
    }

    public function reelsLike()
    {
        return $this->hasMany(Reels_like::class);
    }
    public function reelsComment()
    {
        return $this->hasMany(Reels_comment::class);
    }
}
