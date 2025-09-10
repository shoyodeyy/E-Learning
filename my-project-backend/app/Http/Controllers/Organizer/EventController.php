<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Http\Resources\EventResource;
use App\Models\Events;

class EventController extends Controller
{
    public function index()
    {
        $events = Events::with(['organizer', 'approvedByAdmin'])->get();
        return EventResource::collection($events);
    }
}
