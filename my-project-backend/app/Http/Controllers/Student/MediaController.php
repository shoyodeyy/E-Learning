<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\MediaGallery;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class MediaController extends Controller
{
    /**
     * GET /api/media
     * Lấy danh sách media, có thể phân trang hoặc filter theo event/department
     */
    public function index(Request $request): JsonResponse
    {
        $query = MediaGallery::query()->with(['event', 'uploader']);

        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        $mediaList = $query->orderByDesc('uploaded_on')->paginate(10);

        return response()->json($mediaList);
    }

    /**
     * GET /api/media/{id}
     * Lấy chi tiết 1 media
     */
    public function show(int $id): JsonResponse
    {
        $media = MediaGallery::with(['event', 'uploader'])->find($id);

        if (!$media) {
            return response()->json(['message' => 'Media not found'], 404);
        }

        return response()->json($media);
    }

    /**
     * POST /api/media
     * Thêm mới một media
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'event_id'    => 'nullable|integer|exists:events,event_id',
            'file_type'   => 'required|string|max:50',
            'file_url'    => 'required|url',
            'file_name'   => 'required|string|max:255',
            'caption'     => 'nullable|string|max:255',
            'department'  => 'nullable|string|max:100',
            'event_year'  => 'nullable|integer|min:1900|max:' . date('Y'),
            'is_featured' => 'boolean',
            'file_size'   => 'nullable|numeric|min:0',
            'uploaded_by' => 'required|integer|exists:users,user_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['uploaded_on'] = now();

        $media = MediaGallery::create($data);

        return response()->json([
            'message' => 'Media created successfully',
            'media' => $media,
        ], 201);
    }

    /**
     * DELETE /api/media/{id}
     * Xóa một media
     */
    public function destroy(int $id): JsonResponse
    {
        $media = MediaGallery::find($id);

        if (!$media) {
            return response()->json(['message' => 'Media not found'], 404);
        }

        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }
}
