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
    public function index()
    {
        $user = auth()->user();

        $query = Event::with(['organizer', 'approvedByAdmin'])
            ->orderBy('start_at', 'desc');

        if ($user && $user->hasRole('admin')) {
            $events = $query->paginate(6);
        } elseif ($user && $user->hasRole('organizer')) {
            $events = $query->where('organizerId', $user->user_id)->paginate(6);
        } else {
            $events = $query->where('status', 'approved')->paginate(6);
        }

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
            $path = $file->storeAs('events/banners', $fileName, 'public');
            $event->bannerImage = asset('storage/' . $path);
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
        $user = auth()->user();

        \Log::info('Event update attempt', [
            'auth_id' => $user->user_id,
            'role' => $user->role,
            'event_organizer' => $event->organizerId,
            'event_status' => $event->status
        ]);

        if (in_array($event->status, ['completed'])) {
            return response()->json([
                'message' => 'Cannot update completed or cancelled events'
            ], 403);
        }

        if (!$user->hasRole('admin') && $user->user_id !== $event->organizerId) {
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

        if ($request->hasFile('bannerImage')) {
            if ($event->bannerImage) {
                $oldPath = str_replace(asset('storage/'), '', $event->bannerImage);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $file = $request->file('bannerImage');
            $fileName = $event->event_id . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('events/banners', $fileName, 'public');
            $event->bannerImage = asset('storage/' . $path);
        }

        $event->save();

        // Xử lý notification cho từng trạng thái
        if (!$user->hasRole('admin')) {
            $admins = User::where('role', 'admin')->get();

            if (in_array($originalStatus, ['approved', 'pending_update', 'pending_create']) && $event->wasChanged()) {
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
                        'message' => "Event {$event->title} has been updated by {$event->organizerId}",
                        'type' => $typeMap[$originalStatus],
                        'is_read' => 0,
                    ]);

                    event(new \App\Events\NewNotification($notification));
                }

                $message = 'Event updated successfully. Status reset to pending for re-approval.';
            }

            if ($originalStatus === 'pending_delete' && $event->wasChanged()) {
                return response()->json([
                    'message' => 'You can not update the event in pending_delete status'
                ], 403);
            }
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
        $user = auth()->user();

        if (!$user->hasRole('admin') && $event->status === 'completed') {
            return response()->json([
                'message' => 'Completed events cannot be deleted.'
            ], 403);
        }

        if ($user->hasRole('admin')) {
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
            $event->delete();
            return response()->json([
                'message' => 'Event deleted successfully (pending create).'
            ], 200);
        }

        if (in_array($event->status, ['approved', 'pending_update'])) {
            $event->update([
                'status' => 'pending_delete',
                'approvedBy' => null
            ]);

            // Gửi notification cho admin
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                $notification = Notification::create([
                    'user_id' => $admin->user_id,
                    'event_id' => $event->event_id,
                    'message' => "Event deletion requested for {$event->title} by {$user->user_id}",
                    'type' => 'event_pending_delete',
                    'is_read' => 0,
                ]);

                event(new \App\Events\NewNotification($notification));
            }

            return response()->json([
                'message' => 'Event deletion request sent. Waiting for admin approval.'
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid action for current event status.'
        ], 400);
    }


    public function approve($id)
    {
        $event = Event::findOrFail($id);
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!in_array($event->status, ['pending_create', 'pending_update', 'pending_delete'])) {
            return response()->json(['message' => 'This event is not pending approval.'], 403);
        }

        if ($event->status === 'pending_delete') {
            $event->delete();
            return response()->json(['message' => 'Event deleted successfully!']);
        }

        $event->update([
            'status' => 'approved',
            'approvedBy' => $user->user_id,
        ]);

        // Gửi notification cho organizer
        $notification = Notification::create([
            'user_id' => $event->organizerId,
            'event_id' => $event->event_id,
            'message' => "Your event {$event->title} has been approved by admin",
            'type' => 'event_approved',
            'is_read' => 0,
        ]);
        event(new \App\Events\NewNotification($notification));

        return response()->json([
            'message' => 'Event approved successfully!',
            'data' => new EventResource($event)
        ]);
    }


    public function reject($id)
    {
        $event = Event::findOrFail($id);
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!in_array($event->status, ['pending_create', 'pending_update'])) {
            return response()->json(['message' => 'This event is not pending rejection.'], 400);
        }

        $event->update([
            'status' => 'rejected',
            'approvedBy' => $user->user_id,
        ]);

        // Gửi notification cho organizer
        $notification = Notification::create([
            'user_id' => $event->organizerId,
            'event_id' => $event->event_id,
            'message' => "Your event {$event->title} has been rejected by admin",
            'type' => 'event_rejected',
            'is_read' => 0,
        ]);
        event(new \App\Events\NewNotification($notification));

        return response()->json([
            'message' => 'Event rejected successfully!',
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
}
