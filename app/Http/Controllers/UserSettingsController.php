<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserSettingsController extends Controller
{
    public function updateUser(Request $request)
    {
        try {
            $user = Auth::user();

            $data = $request->validate([
                'name' => 'nullable|string',
                'email' => 'nullable|email|string',
                'bio' => 'nullable|string',
                'password' => 'nullable|string',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            ]);

            if (isset($data['name'])) {
                $user->name = $data['name'];
                $user->update(['name'=>$user->name]);
            }

            if (isset($data['email'])) {
                $user->email = $data['email'];
                $user->update(['email'=>$user->email]);
            }

            if (isset($data['password'])) {
                $user->password = bcrypt($data['password']);
                $user->update(['password'=>$user->password]);
            }

            if ($request->hasFile('avatar')) {
                $imagePath = $request->file('avatar')->store('public/images/avatars');
                $data['avatar'] = url(\Storage::url($imagePath));
                $user->avatar = $data['avatar'] ;
                $user->update(['avatar'=>$user->avatar]);
            }

            if (isset($data['bio'])) {
                $user->bio = $data['bio'];
                $user->update(['bio'=>$user->bio]);
            }

            $user->save();

            return response()->json(['message' => 'User updated successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error updating user', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to update user'], 500);
        }
    }
}
