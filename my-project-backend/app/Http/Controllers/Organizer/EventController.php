<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Event::with(['organizer', 'approvedByAdmin'])
            ->orderBy('start_at', 'desc');

        // Search toàn bộ (title + venue + description)
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('venue', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter (status, category)
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }
        if ($user && $user->hasRole('admin')) {
            $events = $query->paginate(6);
        } elseif ($user && $user->hasRole('organizer')) {
            $events = $query->where('organizerId', $user->user_id)->paginate(6);
        } else {
            if (!($request->has('status') && $request->status !== 'all')) {
                $query->where('status', 'approved');
            }
            $events = $query->paginate(6);
        }

        return EventResource::collection($events);
    }


    public function show($id)
    {
        // $user = auth()->user();
        $event = Event::with(['organizer', 'approvedByAdmin'])->where('event_id', $id)->firstOrFail();
        if (!$event) {

            return response()->json([
                'message' => 'Event not found'
            ], 404);
        }

        // If user is authenticated
        // if ($user) {
        //     if ($user->hasRole('admin')) {
        //         // Admin can see all events
        //         // No additional filter needed
        //     } elseif ($user->hasRole('organizer')) {
        //         // Organizer can only see their own events
        //         $query->where('organizerId', $user->user_id);
        //     } else {
        //         // Regular users can only see approved events
        //         $query->where('status', 'approved');
        //     }
        // } else {
        //     // Unauthenticated users can only see approved events
        //     $query->where('status', 'approved');
        // }

        // $event = $query->first();

        // if (!$event) {
        //     return response()->json([
        //         'message' => 'Event not found or you do not have permission to view this event',
        //         'debug' => [
        //             'requested_id' => $id,
        //             'user_id' => $user ? $user->user_id : null,
        //             'user_role' => $user ? $user->role : null
        //         ]
        //     ], 404);
        // }

        return new EventResource($event);
    }

    public function showWithQuantity($quantity)
    {
        $quantity = (int) $quantity;

        if ($quantity <= 0) {
            return response()->json([
                'message' => 'Quantity must be a positive integer.'
            ], 400);
        }

        $events = Event::with(['organizer', 'approvedByAdmin'])
            ->orderBy('start_at', 'desc')
            ->take($quantity)
            ->get();

        return EventResource::collection($events);
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
            'bannerImage' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Changed from 'images' to 'image'
            'status' => 'nullable|string',
        ]);

        $data['status'] = 'pending_create';
        $data['organizerId'] = auth()->user()->user_id;
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

        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $notification = Notification::create([
                'user_id' => $admin->user_id,
                'event_id' => $event->event_id,
                'message' => "There is a new event to approve: {$event->title}",
                'type' => 'event_pending',
                'is_read' => 0,
            ]);

            event(new \App\Events\NewNotification($notification));
        }

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

        \Log::info('Event update attempt', [
            'auth_id' => $user->user_id,
            'role' => $user->role,
            'event_organizer' => $event->organizerId,
            'event_status' => $event->status
        ]);

        if (in_array($event->status, ['completed'])) {
            return response()->json([
                'message' => 'Cannot update completed events'
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

        $event->fill(collect($data)->except('bannerImage')->toArray());

        $isDirty = $event->isDirty();

        if ($request->hasFile('bannerImage')) {
            if ($event->bannerImage) {
                // Loại bỏ '/storage/' từ đường dẫn để có đường dẫn thật trong storage
                $oldPath = str_replace('/storage/', '', $event->bannerImage);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $file = $request->file('bannerImage');
            $fileName = $event->event_id . '.' . $file->getClientOriginalExtension();

            $path = $file->storeAs('events/banners', $fileName, 'public');
            $event->bannerImage = asset('storage/' . $path);

            $isDirty = true;
        }

        $event->save();


        if (!$user->hasRole('admin')) {
            $admins = User::where('role', 'admin')->get();

            if (in_array($originalStatus, ['approved', 'pending_update', 'pending_create']) && $isDirty) {
                $statusUpdateMap = [
                    'approved' => 'pending_update',
                    'pending_update' => 'pending_update',
                    'pending_create' => 'pending_create',
                ];

                $typeMap = [
                    'approved' => 'event_update',
                    'pending_update' => 'event_update',
                    'pending_create' => 'event_pending_update',
                ];

                $event->update([
                    'status' => $statusUpdateMap[$originalStatus],
                    'approvedBy' => null,
                ]);
                foreach ($admins as $admin) {
                    $notification = Notification::create([
                        'user_id' => $admin->user_id,
                        'event_id' => $event->event_id,
                        'message' => "Event {$event->title} has been updated by organizer {$event->organizerId}",
                        'type' => $typeMap[$originalStatus],
                        'is_read' => 0,
                    ]);
                    event(new \App\Events\NewNotification($notification));
                }
                $message = 'Update request sent. Waiting for admin approval.';
            }

            if ($originalStatus === 'pending_delete' && $isDirty) {
                return response()->json([
                    'message' => 'You cannot update the event while it is in pending_delete status'
                ], 403);
            }
        }

        $event->load(['organizer', 'approvedByAdmin']);

        return response()->json([
            'message' => $message,
            'data' => new EventResource($event)
        ]);
    }


    public function destroy($id)
    {
        $event = Event::findOrFail($id);

        // Kiểm tra authentication trước
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $user = auth()->user();

        $isAdmin = method_exists($user, 'hasRole') ? $user->hasRole('admin') : ($user->role === 'admin');

        if (!$isAdmin && $user->user_id !== $event->organizerId) {
            return response()->json([
                'message' => 'You can only delete your own events'
            ], 403);
        }

        if (!$isAdmin) {
            if ($event->status === 'completed') {
                return response()->json([
                    'message' => 'Cannot delete completed events'
                ], 403);
            }

            // Organizer xóa event chưa được duyệt
            if ($event->status === 'pending_create') {
                if ($event->bannerImage) {
                    $filePath = str_replace('/storage/', '', $event->bannerImage);
                    if (Storage::disk('public')->exists($filePath)) {
                        Storage::disk('public')->delete($filePath);
                    }
                }

                $event->delete();
                return response()->json([
                    'message' => 'Event deleted successfully (not yet approved).'
                ]);
            }

            // Organizer gửi yêu cầu xóa cho admin duyệt
            if (in_array($event->status, ['approved', 'pending_update'])) {
                $event->update([
                    'status' => 'pending_delete',
                    'approvedBy' => null,
                ]);

                $admins = User::where('role', 'admin')->get();

                foreach ($admins as $admin) {
                    $notification = Notification::create([
                        'user_id' => $admin->user_id,
                        'event_id' => $event->event_id,
                        'message' => "Organizer {$event->organizerId} requested deletion of event {$event->title}",
                        'type' => 'event_pending_delete',
                        'is_read' => 0,
                    ]);

                    event(new \App\Events\NewNotification($notification));
                }

                return response()->json([
                    'message' => 'Delete request sent. Waiting for admin approval.'
                ], 200);
            }

            if ($event->status === 'pending_delete') {
                return response()->json([
                    'message' => 'Event is already waiting for admin delete approval.'
                ], 403);
            }
        }

        // Admin xóa trực tiếp
        if ($isAdmin) {
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
    }



    public function approve($id)
    {
        $event = Event::findOrFail($id);
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            return response()->json([
                'message' => 'Only admins can approve events'
            ], 403);
        }

        switch ($event->status) {
            case 'pending_create':
                $event->update([
                    'status' => 'approved',
                    'approvedBy' => $user->user_id,
                ]);
                $message = "Event {$event->title} has been approved (creation).";
                break;

            case 'pending_update':
                $event->update([
                    'status' => 'approved',
                    'approvedBy' => $user->user_id,
                ]);
                $message = "Event {$event->title} has been approved (update).";
                break;

            case 'pending_delete':
                $event->delete();
                $message = "Event {$event->title} has been deleted after admin approval.";
                break;

            default:
                return response()->json([
                    'message' => 'This event is not pending approval'
                ], 400);
        }

        return response()->json([
            'message' => $message,
            'data' => $event->status === 'pending_delete' ? null : new EventResource($event)
        ]);
    }


    public function reject($id)
    {
        $event = Event::findOrFail($id);
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            return response()->json([
                'message' => 'Only admins can reject events'
            ], 403);
        }

        switch ($event->status) {
            case 'pending_create':
                $event->update([
                    'status' => 'rejected_create',
                    'approvedBy' => null,
                ]);
                $message = "Event {$event->title} creation has been rejected. Organizer needs to update and resubmit.";
                break;

            case 'pending_update':
                $event->update([
                    'status' => 'approved',
                ]);
                $message = "Event {$event->title} update has been rejected.";
                break;

            case 'pending_delete':
                $event->update([
                    'status' => 'approved',
                ]);
                $message = "Event {$event->title} deletion has been rejected.";
                break;

            default:
                return response()->json([
                    'message' => 'This event is not pending approval'
                ], 400);
        }

        return response()->json([
            'message' => $message,
            'data' => new EventResource($event)
        ]);
    }


    public function pending()
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $events = Event::with(['organizer'])
            ->whereIn('status', ['pending_create', 'pending_update', 'pending_delete'])
            ->orderBy('created_at', 'desc')
            ->paginate(6);

        return EventResource::collection($events);
    }

    public function organizerEvents(Request $request)
    {
        $user = auth()->user();

        $query = Event::with(['organizer', 'approvedByAdmin'])
            ->where('organizerId', $user->user_id)
            ->orderBy('start_at', 'desc');

        // optional filters
        if ($search = $request->query('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status = $request->query('status') and $status !== 'all') {
            $query->where('status', $status);
        }

        if ($category = $request->query('category') and $category !== 'all') {
            $query->where('category', $category);
        }

        $events = $query->paginate(8, [
            'event_id',
            'title',
            'status',
            'organizerId',
            'start_at',
            'bannerImage'
        ]);

        return response()->json($events);
    }
}
