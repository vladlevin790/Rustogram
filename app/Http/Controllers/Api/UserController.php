<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
   public function index() {
        $user = User::all();
   }

   public function getAnotherUser($userId) {
       $user = User::FindOrFail($userId);
       return response()->json($user);
   }
}
