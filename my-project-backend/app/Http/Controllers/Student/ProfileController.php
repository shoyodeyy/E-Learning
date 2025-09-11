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
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        try {

            $user = $request->user();

            // --- Validation rules ---
            $rules = [
                'name'    => 'required|string|min:3|max:255',
                'email'   => 'sometimes|required|email|unique:users,email,' . $user->user_id . ',user_id',
                'phone'   => [
                    'nullable',
                    'regex:/^(0|\+84)[0-9]{9,10}$/',
                    'unique:users,phone,' .  $user->user_id . ',user_id',
                ],
                'address' => 'nullable|string|max:255',
                'gender'  => 'nullable|in:male,female,other',
                'profile' => 'nullable|string',
                'avatar'  => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            ];

            // --- Nếu user là admin hoặc organizer thì cho phép department & enrollment_no ---
            if (in_array($user->role, ['admin', 'organizer'])) {
                $rules['department']    = 'nullable|string|max:100';
                $rules['enrollment_no'] = 'nullable|string|max:50';
            }

            $validated = $request->validate($rules, [
                'phone.regex'  => 'Phone number must start with 0 or +84 and contain 9–10 digits.',
                'phone.unique' => 'This phone number is already in use.',
                'avatar.image' => 'The uploaded file must be an image.',
                'avatar.mimes' => 'Allowed formats: jpg, jpeg, png, gif.',
                'avatar.max'   => 'Avatar size must be less than 2MB.',
            ]);

            // --- Nếu user login bằng Google và chưa update thủ công ---
            if ($user->google_id && !$request->has('name')) {
                $validated['name'] = $user->name;
            }

            // --- Xử lý avatar ---
            if ($request->hasFile('avatar')) {
                // Xóa avatar cũ nếu có
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }

                // Lưu avatar mới
                $path = $request->file('avatar')->store('avatars', 'public');
                $validated['avatar'] = $path;
            } else {
                // Nếu không upload, loại bỏ avatar khỏi validated để tránh ghi null
                unset($validated['avatar']);
            }

            // --- Update user ---
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
