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
                    'unique:users,phone,' . $user->user_id . ',user_id',
                ],
                'address' => 'nullable|string|max:255',
                'gender'  => 'nullable|in:male,female,other',
                'profile' => 'nullable|string',
                'avatar'  => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            ];

            // --- Nếu user là admin hoặc organizer thì cho phép department & enrollment_no ---
            if (in_array($user->role, ['admin', 'organizer'])) {
                $rules['department'] = 'required|in:Computer Science,Electrical Engineering,Mechanical Engineering,Business Administration,Marketing,Finance and Accounting,Human Resources,Event Management Office,Library and Information Center';
                $rules['enrollment_no'] = 'required|digits:6';
            }


            $validated = $request->validate($rules, [
                'phone.regex'  => 'Phone number must start with 0 or +84 and contain 9–10 digits.',
                'phone.unique' => 'This phone number is already in use.',
                'avatar.image' => 'The uploaded file must be an image.',
                'avatar.mimes' => 'Allowed formats: jpg, jpeg, png, gif.',
                'avatar.max'   => 'Avatar size must be less than 2MB.',
                'enrollment_no.digits' => 'Enrollment number must be exactly 6 digits.',
                'enrollment_no.unique' => 'Enrollment number is already in use.',
            ]);

            // --- Nếu user login bằng Google và chưa update thủ công ---
            if ($user->google_id && !$request->has('name')) {
                $validated['name'] = $user->name;
            }

            // --- Xử lý avatar ---
            if ($request->hasFile('avatar')) {
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }
                $path = $request->file('avatar')->store('avatars', 'public');
                $validated['avatar'] = $path;
            } else {
                unset($validated['avatar']);
            }


            if (in_array($user->role, ['admin', 'organizer']) && !empty($validated['enrollment_no'])) {
                $prefix = $user->role === 'admin' ? 'ADM' : 'OR';
                $fullEnrollmentNo = $prefix . $validated['enrollment_no'];


                $exists = User::where('enrollment_no', $fullEnrollmentNo)
                    ->where('user_id', '!=', $user->user_id)
                    ->exists();

                if ($exists) {
                    return response()->json([
                        'message' => 'Validation error',
                        'errors'  => [
                            'enrollment_no' => ['This enrollment number is already taken.'],
                        ],
                    ], 422);
                }


                $validated['enrollment_no'] = $fullEnrollmentNo;
            }

            // --- Update user ---
            $user->update($validated);
            $user->refresh();

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
