<?php

namespace App\Services;

use App\Models\User;

class AuthService
{
    public function createUser(array $data)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'last_login' => now(),
            'is_online' => true,
        ]);

        return $this->generateToken($user);
    }

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
