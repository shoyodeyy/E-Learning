<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        try {
            if (!$request->user()) {
                return response()->json([
                    'message' => 'Unauthorized. Please log in.'
                ], 401);
            }

            $user = $request->user();

            // chống spam update profile
            $key = Str::lower("profile:update:" . $request->ip());
            if (RateLimiter::tooManyAttempts($key, 5)) {
                return response()->json([
                    'message' => 'Too many update attempts. Please wait 5 minutes.'
                ], 429);
            }
            RateLimiter::hit($key, 300);

            // validate dữ liệu
            $validated = $request->validate([
                'name'    => 'required|string|min:3|max:255',
                'email'   => 'required|email|unique:users,email,' . $user->id,
                'phone'   => [
                    'nullable',
                    'regex:/^(0|\+84)[0-9]{9,10}$/',
                    'unique:users,phone,' . $user->id,
                ],
                'address' => 'nullable|string|max:255',
                'gender'  => 'nullable|in:male,female,other',
                'profile' => 'nullable|string',
                'avatar'  => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            ], [
                'phone.regex'  => 'Phone number must start with 0 or +84 and contain 9–10 digits.',
                'phone.unique' => 'This phone number is already in use.',
                'avatar.image' => 'The uploaded file must be an image.',
                'avatar.mimes' => 'Allowed formats: jpg, jpeg, png, gif.',
                'avatar.max'   => 'Avatar size must be less than 2MB.',
            ]);
            // nếu user là Google login và chưa update thủ công
            if ($user->google_id && !$request->has('name')) {
                $validated['name'] = $user->name; // giữ tên Google cũ
            }

            // xử lý avatar nếu có upload
            if ($request->hasFile('avatar')) {

                // xóa avatar cũ nếu có
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }

                // lưu avatar mới
                $path = $request->file('avatar')->store('avatars', 'public');
                $validated['avatar'] = $path;
            }

            $user->update($validated);


            return response()->json([
                'message' => 'Profile updated successfully.',
                'user'    => $user,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors'  => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong while updating profile.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
