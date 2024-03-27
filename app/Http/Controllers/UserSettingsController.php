<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserSettingsController extends Controller
{
    public function updateUser(Request $request){
        $user = Auth::user();

        $data = $request->validate([
            'name'=>'nullable|string',
            'email'=>'nullable|email|string',
            'password'=>'nullable|string',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ]);

        if (isset($data['name'])) {
            $user->name = $data['name'];
        }

        if (isset($data['email'])) {
            $user->email = $data['email'];
        }

        if (isset($data['password'])) {
            $user->password = bcrypt($data['password']);
        }

        if ($request->hasFile('avatar')) {
            $imagePath = $request->file('avatar')->store('public/images');
            $user->avatar = url(\Storage::url($imagePath));
        }

        $user->save();
        return response()->json(['message' => 'User updated successfully'], 200);
    }
}
