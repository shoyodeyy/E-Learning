<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with(['organizer', 'approvedByAdmin'])
            ->orderBy('start_at', 'desc')
            ->paginate(6);

        return EventResource::collection($events);
    }

    public function show($id)
    {
        $event = Event::with(['organizer', 'approvedByAdmin'])
            ->where('event_id', $id)
            ->first();

        if (!$event) {
            return response()->json([
                'message' => 'Event not found'
            ], 404);
        }

        return new EventResource($event);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:Cultural Event,Technical Fests,Sports Meets,Annual Day Functions,Workshops and Seminars,Intercollegiate Competitions',
            'description' => 'nullable|string',
            'start_at' => 'required|date_format:Y-m-d H:i:s',
            'duration_minutes' => 'required|integer|min:1|max:1440',
            'venue' => 'required|string',
            'approvedBy' => 'nullable|string',
            'maxParticipants' => 'required|integer|min:1|max:10000',
            'registrationDeadline' => 'required|date_format:Y-m-d H:i:s',
            'bannerImage' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'status' => 'nullable|string',
        ]);

        $data['status'] = 'pending_create';
        $data['organizerId'] = auth()->id();
        $data['bannerImage'] = '';

        $event = Event::create($data);

        if ($request->hasFile('bannerImage')) {
            $file = $request->file('bannerImage');
            $fileName = $event->event_id . '.' . $file->getClientOriginalExtension();

            // Lưu vào thư mục images/MediaGallery
            $path = $file->storeAs(
                'images/MediaGallery',
                $fileName,
                'public'
            );

            $event->bannerImage = '/storage/' . $path;
            $event->save();
        }

        $event->load(['organizer', 'approvedByAdmin']);

        return new EventResource($event);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        
        // Kiểm tra authentication trước
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }
        
        $user = auth()->user();

        // Debug log để xem chi tiết khi lỗi 403
        \Log::info('Event update attempt', [
            'auth_id' => $user->user_id,
            'role' => $user->role,
            'event_organizer' => $event->organizerId,
            'event_status' => $event->status
        ]);

        // check status (không cho sửa nếu đã hoàn thành hoặc hủy)
        if (in_array($event->status, ['completed'])) {
            return response()->json([
                'message' => 'Cannot update completed or cancelled events'
            ], 403);
        }

        // check role (chỉ admin hoặc chính organizer mới được sửa)
        // Kiểm tra hasRole method có tồn tại không
        $isAdmin = method_exists($user, 'hasRole') ? $user->hasRole('admin') : ($user->role === 'admin');
        
        if (!$isAdmin && $user->user_id !== $event->organizerId) {
            return response()->json([
                'message' => 'You can only update your own events'
            ], 403);
        }

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|in:Cultural Event,Technical Fests,Sports Meets,Annual Day Functions,Workshops and Seminars,Intercollegiate Competitions',
            'description' => 'sometimes|nullable|string',
            'start_at' => 'sometimes|required|date_format:Y-m-d H:i:s',
            'duration_minutes' => 'sometimes|required|integer|min:1|max:1440',
            'venue' => 'sometimes|required|string',
            'approvedBy' => 'nullable|string',
            'organizerId' => 'sometimes|required|integer|exists:users,user_id',
            'maxParticipants' => 'sometimes|required|integer|min:1|max:10000',
            'registrationDeadline' => 'sometimes|required|date_format:Y-m-d H:i:s',
            'bannerImage' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'status' => 'nullable|string',
        ]);

        $message = 'Event updated successfully.';
        $originalStatus = $event->status;

        // cập nhật các field trừ bannerImage
        $event->fill(collect($data)->except('bannerImage')->toArray());

        // nếu có upload banner mới
        if ($request->hasFile('bannerImage')) {
            // xoá file cũ nếu tồn tại
            if ($event->bannerImage) {
                // Loại bỏ '/storage/' từ đường dẫn để có đường dẫn thật trong storage
                $oldPath = str_replace('/storage/', '', $event->bannerImage);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $file = $request->file('bannerImage');
            $fileName = $event->event_id . '.' . $file->getClientOriginalExtension();

            // Sử dụng cùng thư mục với store() - images/MediaGallery
            $path = $file->storeAs(
                'images/MediaGallery',
                $fileName,
                'public'
            );

            $event->bannerImage = '/storage/' . $path;
        }

        $event->save();

        // Nếu organizer sửa event đã được duyệt → reset lại pending để chờ duyệt lại
        if (!$isAdmin && $originalStatus === 'approved' && $event->wasChanged()) {
            $event->update([
                'status' => 'pending_update',
                'approvedBy' => null
            ]);

            $message = 'Event updated successfully. Status reset to pending for re-approval.';
        }

        // Nếu organizer sửa event đã được duyệt và đang pending_update
        if (!$isAdmin && $originalStatus === 'pending_update' && $event->wasChanged()) {
            $event->update([
                'status' => 'pending_update',
                'approvedBy' => null
            ]);

            $message = 'Event updated successfully. Status reset to pending for re-approval.';
        }

        // Nếu organizer sửa event chưa được duyệt
        if (!$isAdmin && $originalStatus === 'pending_create' && $event->wasChanged()) {
            $event->update([
                'status' => 'pending_create',
                'approvedBy' => null
            ]);

            $message = 'Event updated successfully. Status reset to pending for re-approval.';
        }

        // Nếu organizer sửa event đang đc pending_delete
        if (!$isAdmin && $originalStatus === 'pending_delete' && $event->wasChanged()) {
            return response()->json([
                'message' => 'You can not update the event in pending_delete status'
            ], 403);
        }

        $event->load(['organizer', 'approvedByAdmin']);

        return response()->json([
            'message' => $message,
            'data' => new EventResource($event)
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        
        // Kiểm tra authentication trước
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }
        
        $user = auth()->user();

        // check status
        $isAdmin = method_exists($user, 'hasRole') ? $user->hasRole('admin') : ($user->role === 'admin');
        
        if (!$isAdmin && $event->status === 'completed') {
            return response()->json([
                'message' => 'Completed events cannot be deleted.'
            ], 403);
        }

        // check role
        if ($isAdmin) {
            // Xóa file banner nếu có
            if ($event->bannerImage) {
                $filePath = str_replace('/storage/', '', $event->bannerImage);
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }
            }
            
            $event->delete();

            return response()->json([
                'message' => 'Event deleted successfully (by admin).'
            ], 200);
        }

        if ($user->user_id !== $event->organizerId) {
            return response()->json([
                'message' => 'You can only delete your own events'
            ], 403);
        }

        if ($event->status === 'pending_create') {
            // Xóa file banner nếu có
            if ($event->bannerImage) {
                $filePath = str_replace('/storage/', '', $event->bannerImage);
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }
            }
            
            $event->delete();

            return response()->json([
                'message' => 'Event deleted successfully (pending create).'
            ]);
        }

        if (in_array($event->status, ['approved', 'pending_update'])) {
            $event->update([
                'status' => 'pending_delete',
                'approvedBy' => null
            ]);

            return response()->json([
                'message' => 'Event deletion request sent. Waiting for admin approval.'
            ]);
        }

        return response()->json([
            'message' => 'Invalid action for current event status.'
        ], 400);
    }
}