<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserSignUpUpdateController extends Controller
{
    public function insertSignUpUserInfo(Request $request)
    {
        try {
            $user = Auth::user();
            $data = $request->validate([
                'birthday' => 'required|date',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif',
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
        } catch (\Exception $e) {
            Log::info($e->getMessage());
        }
    }

}
