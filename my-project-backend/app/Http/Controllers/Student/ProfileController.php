<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthorized. Please log in.'
            ], 401);
        }

        $user = $request->user();

        if ($user->role !== 'participant') {
            return response()->json([
                'message' => 'Only participants can view their profile.'
            ], 403);
        }

        return response()->json([
            'user' => $user,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        try {
            if (!$request->user()) {
                return response()->json([
                    'message' => 'Unauthorized. Please log in.'
                ], 401);
            }

            $user = $request->user();

            // chỉ student mới được update
            if ($user->role !== 'participant') {
                return response()->json([
                    'message' => 'Only participants can update their profile.'
                ], 403);
            }


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
                $validated['name'] = $user->name;
            }

            // xử lý avatar nếu có upload
            if ($request->hasFile('avatar')) {
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }
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
