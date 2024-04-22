<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;

class PasswordResetController extends Controller
{
    public function resetPassword(Request $request) {
        try {
            $data = $request->validate([
                "email" => "required|string",
                "password" => "required|string",
                "password_confirmation" => ['required', Password::min(8)->letters()->numbers()->symbols()]
            ]);
            $user = User::where('email', $data['email'])->first();
            Log::info($user);
            if($user) {
                if (isset($data['password']) && isset($data['password_confirmation']) && Hash::check($data['password'], $user->password)) {
                    $user->update(['password' => bcrypt($data['password_confirmation'])]);
                    return response()->json(['success' => true,'status'=>200]);
                } else {
                    echo $user->password;
                }
            }
        } catch (\Exception $e) {
            Log::info($e->getMessage());
        }
    }
}
