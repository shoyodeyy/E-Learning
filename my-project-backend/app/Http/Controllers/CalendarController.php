<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CalendarController extends Controller
{

    public function getCalendarLinks($id)
    {
        $event = Event::findOrFail($id);
        
        $eventTz = $event->timezone ?? 'Asia/Ho_Chi_Minh';
        $start = Carbon::parse($event->start_at)->setTimezone($eventTz);
        $end = $start->copy()->addMinutes($event->duration_minutes ?? 60);
        
        $googleStart = $start->utc()->format('Ymd\THis\Z');
        $googleEnd = $end->utc()->format('Ymd\THis\Z');
        
        $description = $event->description ? strip_tags($event->description) : '';
        $filename = preg_replace('/[^\w\-.]/', '_', $event->title) . '.ics';
        
        $googleUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE"
            . "&text=" . urlencode($event->title)
            . "&dates={$googleStart}/{$googleEnd}"
            . "&details=" . urlencode($description)
            . "&location=" . urlencode($event->venue ?? '');
        
        return response()->json([
            "google_url" => $googleUrl,
            "ics_url" => url("/api/events/{$event->event_id}/calendar/ics"),
            "filename" => $filename,
            "title" => $event->title,
        ]);
    }

    public function downloadICS($id)
    {
        $event = Event::findOrFail($id);
        
        $eventTz = $event->timezone ?? 'Asia/Ho_Chi_Minh';
        $start = Carbon::parse($event->start_at)->setTimezone($eventTz);
        $end = $start->copy()->addMinutes($event->duration_minutes ?? 60);
        
        $description = $event->description ? strip_tags($event->description) : '';
        
        $ics = "BEGIN:VCALENDAR\r\n"
            . "VERSION:2.0\r\n"
            . "PRODID:-//EventSphere//Calendar//EN\r\n"
            . "BEGIN:VEVENT\r\n"
            . "UID:event-{$event->event_id}@eventsphere.com\r\n"
            . "DTSTAMP:" . gmdate('Ymd\THis\Z') . "\r\n"
            . "DTSTART;TZID={$eventTz}:" . $start->format('Ymd\THis') . "\r\n"
            . "DTEND;TZID={$eventTz}:" . $end->format('Ymd\THis') . "\r\n"
            . "SUMMARY:" . addslashes($event->title) . "\r\n"
            . "DESCRIPTION:" . addslashes($description) . "\r\n"
            . "LOCATION:" . addslashes($event->venue ?? '') . "\r\n"
            . "END:VEVENT\r\n"
            . "END:VCALENDAR\r\n";
        
        $filename = preg_replace('/[^\w\-.]/', '_', $event->title) . '.ics';
        
        return response($ics)
            ->header('Content-Type', 'text/calendar; charset=utf-8')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }
}
