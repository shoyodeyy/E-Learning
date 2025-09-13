<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ProfileController extends Controller
{
    // Departments available for selection
    private array $departments = ['IT', 'HR', 'Finance', 'Marketing', 'Computer Science'];


    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        // Only generate enrollment number if null
        if (in_array($user->role, ['admin', 'organizer']) && empty($user->enrollment_no)) {
            $prefix = $user->role === 'admin' ? 'ADM' : 'OR';

            do {
                $randomNumber = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
                $fullEnrollmentNo = $prefix . $randomNumber;

                $exists = User::where('enrollment_no', $fullEnrollmentNo)->exists();
            } while ($exists);

            $user->enrollment_no = $fullEnrollmentNo;
            $user->save();
        }

        return response()->json([
            'user' => $user,
            'departments' => $this->departments, // send available departments to frontend
        ]);
    }

    /**
     * Update the authenticated user's profile
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            // --- Validation rules ---
            $rules = [
                'name' => 'required|string|min:3|max:255',
                'email' => 'sometimes|required|email|unique:users,email,' . $user->user_id . ',user_id',
                'phone' => [
                    'nullable',
                    'regex:/^(0|\+84)[0-9]{9,10}$/',
                    'unique:users,phone,' . $user->user_id . ',user_id',
                ],
                'address' => 'nullable|string|max:255',
                'gender' => 'nullable|in:male,female,other',
                'profile' => 'nullable|string',
                'avatar' => 'nullable|images|mimes:jpg,jpeg,png,gif|max:2048',
                'department' => 'required|string|in:' . implode(',', $this->departments),
            ];

            $validated = $request->validate($rules, [
                'phone.regex' => 'Phone number must start with 0 or +84 and contain 9–10 digits.',
                'phone.unique' => 'This phone number is already in use.',
                'avatar.images' => 'The uploaded file must be an images.',
                'avatar.mimes' => 'Allowed formats: jpg, jpeg, png, gif.',
                'avatar.max' => 'Avatar size must be less than 2MB.',
                'department.in' => 'Selected department is invalid.',
            ]);

            // --- Google login fallback for name ---
            if ($user->google_id && !$request->has('name')) {
                $validated['name'] = $user->name;
            }

            // --- Handle avatar upload ---
            if ($request->hasFile('avatar')) {
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }
                $path = $request->file('avatar')->store('avatars', 'public');
                $validated['avatar'] = $path;
            } else {
                unset($validated['avatar']);
            }


            // --- Update user profile ---
            $user->update($validated);

            return response()->json([
                'message' => 'Profile updated successfully.',
                'user' => $user,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong while updating profile.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
