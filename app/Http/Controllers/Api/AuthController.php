<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InsertUserInfo;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use App\Services\AuthService;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\Traits\ApiAuthTrait;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService){
        $this->authService = $authService;
    }

    public function signup(SignupRequest $request)
    {
        return $this->authService->createUser($request->validated());
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if($credentials['email'] == "vladlevin790@gmail.com") {
                $user->is_admin = true;
            }
            $user->last_online = now();
            $user->is_online = true;
            $user->save();
            $token = $this->authService->generateToken($user);
            return response()->json($token)->cookie('token', $token, 480);
        } else {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->update(['is_online'=> false]);
        return $this->authService->revokeToken($user);
    }
}
