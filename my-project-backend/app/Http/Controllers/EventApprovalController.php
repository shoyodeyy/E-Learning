<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\EventApproval;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EventApprovalController extends Controller
{
    /**
     * Lấy danh sách sự kiện cần kiểm duyệt
     */
    public function getPendingEvents(): JsonResponse
    {
        try {
            $pendingEvents = Event::with(['organizer', 'latestApproval'])
                ->whereIn('status', [
                    Event::STATUS_PENDING_CREATE,
                    Event::STATUS_PENDING_UPDATE,
                    Event::STATUS_PENDING_DELETE
                ])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $pendingEvents,
                'message' => 'Danh sách sự kiện cần kiểm duyệt'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách sự kiện: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Duyệt sự kiện
     */
    public function approveEvent(Request $request, $eventId): JsonResponse
    {
        $request->validate([
            'notes' => 'nullable|string|max:1000'
        ]);

        try {
            DB::beginTransaction();

            $event = Event::findOrFail($eventId);
            
            if (!$event->canBeApproved()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sự kiện không thể được duyệt'
                ], 400);
            }

            // Xác định loại approval
            $approvalType = $this->getApprovalTypeFromStatus($event->status);

            // Cập nhật trạng thái sự kiện
            $event->update([
                'status' => Event::STATUS_APPROVED,
                'approvedBy' => Auth::id()
            ]);

            // Tạo bản ghi approval
            EventApproval::create([
                'event_id' => $event->event_id,
                'approved_by' => Auth::id(),
                'action_type' => EventApproval::ACTION_APPROVE,
                'approval_type' => $approvalType,
                'notes' => $request->input('notes'),
                'approved_at' => now()
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $event->load(['organizer', 'latestApproval']),
                'message' => 'Sự kiện đã được duyệt thành công'
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi duyệt sự kiện: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Từ chối sự kiện
     */
    public function rejectEvent(Request $request, $eventId): JsonResponse
    {
        $request->validate([
            'notes' => 'required|string|max:1000'
        ]);

        try {
            DB::beginTransaction();

            $event = Event::findOrFail($eventId);
            
            if (!$event->canBeApproved()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sự kiện không thể được từ chối'
                ], 400);
            }

            // Xác định loại approval và trạng thái rejected tương ứng
            $approvalType = $this->getApprovalTypeFromStatus($event->status);
            $rejectedStatus = $this->getRejectedStatusFromApprovalType($approvalType);

            // Cập nhật trạng thái sự kiện
            $event->update([
                'status' => $rejectedStatus
            ]);

            // Tạo bản ghi approval
            EventApproval::create([
                'event_id' => $event->event_id,
                'approved_by' => Auth::id(),
                'action_type' => EventApproval::ACTION_REJECT,
                'approval_type' => $approvalType,
                'notes' => $request->input('notes'),
                'approved_at' => now()
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $event->load(['organizer', 'latestApproval']),
                'message' => 'Sự kiện đã bị từ chối'
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi từ chối sự kiện: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy lịch sử kiểm duyệt của một sự kiện
     */
    public function getApprovalHistory($eventId): JsonResponse
    {
        try {
            $approvals = EventApproval::with('approver')
                ->where('event_id', $eventId)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $approvals,
                'message' => 'Lịch sử kiểm duyệt'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy lịch sử kiểm duyệt: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper method để lấy approval type từ status
     */
    private function getApprovalTypeFromStatus($status): string
    {
        switch ($status) {
            case Event::STATUS_PENDING_CREATE:
                return EventApproval::TYPE_CREATE;
            case Event::STATUS_PENDING_UPDATE:
                return EventApproval::TYPE_UPDATE;
            case Event::STATUS_PENDING_DELETE:
                return EventApproval::TYPE_DELETE;
            default:
                return EventApproval::TYPE_CREATE;
        }
    }

    /**
     * Helper method để lấy rejected status từ approval type
     */
    private function getRejectedStatusFromApprovalType($approvalType): string
    {
        switch ($approvalType) {
            case EventApproval::TYPE_CREATE:
                return Event::STATUS_REJECTED_CREATE;
            case EventApproval::TYPE_UPDATE:
                return Event::STATUS_REJECTED_UPDATE;
            case EventApproval::TYPE_DELETE:
                return Event::STATUS_REJECTED_DELETE;
            default:
                return Event::STATUS_REJECTED_CREATE;
        }
    }
}
