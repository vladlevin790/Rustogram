<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserSignUpUpdateController extends Controller
{
    public function insertSignUpUserInfo(Request $request)
    {
        $user = Auth::user();
        $data = $request->validate([
            'birthday' => 'required|date',
            'avatar' => 'nullable|image',
            'gender' => 'required|in:male,female',
            'bio' => 'nullable|string|max:255',
        ]);
        if ($request->hasFile('avatar')) {
            $imagePath = $request->file('avatar')->store('public/images/avatars');
            $data['avatar'] = url(\Storage::url($imagePath));
        }

        $data['birthday'] = Carbon::createFromFormat('Y-m-d', $data['birthday'])->format('Y-m-d');
        if ($user) {
            $user->update([
                'avatar' => $data['avatar'] ?? null,
                'birthday' => $data['birthday'],
                'gender' => $data['gender'],
                'bio' => $data['bio'] ?? null,
            ]);
            return response()->json(['message' => 'User updated successfully'], 200);
        } else {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    }

}
