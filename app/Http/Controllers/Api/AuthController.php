<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\Traits\ApiAuthTrait;

class AuthController extends Controller
{
    use ApiAuthTrait;

    public function signup(SignupRequest $request)
    {
        return $this->createUser($request->validated());
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        return Auth::attempt($credentials) ? $this->generateToken(Auth::user()) : $this->invalidCredentials();
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        return $this->revokeToken($user);
    }
}
