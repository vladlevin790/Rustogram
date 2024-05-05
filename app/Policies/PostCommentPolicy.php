<?php

namespace App\Policies;

use App\Models\PostsComments;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostCommentPolicy
{
    use HandlesAuthorization;

    public function update(User $user, PostsComments $comment)
    {
        return $user->id === $comment->user_id;
    }

    public function delete(User $user, PostsComments $comment)
    {
        return $user->id === $comment->user_id;
    }
}
