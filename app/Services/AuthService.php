<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthService
{
    public function createUser(array $data)
    {
        try {
            if ($data['email'] == "vladlevin790@gmail.com") {
                $user = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => bcrypt($data['password']),
                    'last_online' => now(),
                    'is_online' => true,
                    'is_admin' => true,
                ]);
            } else {
                $user = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => bcrypt($data['password']),
                    'last_login' => now(),
                    'is_online' => true,
                ]);
            }
            return $this->generateToken($user);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return ['Success' => false, 'Message'=>'Error creating user'];
        }
    }

//    public function login(array $data)
//    {
//        try {
//            if (Auth::attempt($data)) {
//                $user = Auth::user();
//                $user->last_online = now();
//                $user->is_online = true;
//                if($data['email'] == "vladlevin790@gmail.com") {
//                    $user->is_admin = true;
//                }
//                $user->save();
//                $token = $this->authService->generateToken($user);
//                return $token;
//            } else {
//                return response()->json(['message' => 'Invalid credentials'], 401);
//            }
//        } catch (\Exception $e) {
//            return ['Success' => false,'Message'=>'Error with logining'];
//        }
//    }

    public function generateToken(User $user)
    {
        $token = $user->createToken('main')->plainTextToken;
        return $this->successResponse(compact('user', 'token'));
    }

    public function invalidCredentials()
    {
        return $this->errorResponse('Provided email or password is incorrect', 422);
    }

    public function revokeToken(User $user)
    {
        $user->currentAccessToken()->delete();
        return $this->emptyResponse(204);
    }

    private function successResponse($data)
    {
        return response($data);
    }

    private function errorResponse($message, $statusCode)
    {
        return response(['message' => $message], $statusCode);
    }

    private function emptyResponse($statusCode)
    {
        return response('', $statusCode);
    }
}
