<?php
namespace App\Http\Controllers\Api\Traits;

use App\Models\User;

trait ApiAuthTrait
{
    private function createUser(array $data)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        return $this->generateToken($user);
    }

    private function generateToken(User $user)
    {
        $token = $user->createToken('main')->plainTextToken;
        return $this->successResponse(compact('user', 'token'));
    }

    private function invalidCredentials()
    {
        return $this->errorResponse('Provided email or password is incorrect', 422);
    }

    private function revokeToken(User $user)
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
