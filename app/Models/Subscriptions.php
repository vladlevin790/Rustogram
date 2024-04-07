<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscriptions extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'owner_id',
    ];
    public function user() {
        return $this->belongsTo('user', 'user_id');
    }
}
