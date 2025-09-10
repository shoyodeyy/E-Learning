<?php

namespace App\Http\Controllers;


use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BrowseController extends Controller
{
    public function index(Request $request) {
        $status = $request->query('status');
        $query = Event::query();

        if ($status) {
            $query->where('status', $status);
        }

        return response()->json($query->get());
    }

    public function show($id) {
        $event = Event::findOrFail($id);
        return response()->json($event);
    }

    public function approve($id) {
        $event = Event::findOrFail($id);
        $event->status = 'approved';
        $event->approved_by = Auth::id();
        $event->save();

        return response()->json(["message" => "Event approved successfully!"]);
    }

    public function reject(Request $request, $id) {
        $event = Event::findOrFail($id);
        $event->status = "cancelled";
        $event->approved_by = Auth::id();
        $event->save();

        return response()->json(["message" => "Event rejected successfully!"]);
    }
}
