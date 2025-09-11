<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class CalendarController extends Controller
{

    public function getCalendarLinks($id)
    {
        $event = Event::findOrFail($id);

        $startTimestamp = strtotime($event->start_at);
        $start = gmdate('Ymd\THis\Z', $startTimestamp);


        $description = $event->description ? strip_tags($event->description) : '';

        $googleUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE"
            . "&text=" . urlencode($event->title)
            . "&dates={$start}/{$start}"
            . "&details=" . urlencode($description)
            . "&location=" . urlencode($event->venue ?? '')
            . "&sf=true&output=xml";

        return response()->json([
            "google_url" => $googleUrl,
            "ics_url" => url("/api/events/{$event->event_id}/calendar/ics")
        ]);
    }

    public function downloadICS($id)
    {
        $event = Event::findOrFail($id);

        $startTimestamp = strtotime($event->start_at);
        $start = gmdate('Ymd\THis\Z', $startTimestamp);

        $description = $event->description ? strip_tags($event->description) : '';

        $ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//EventSphere//Calendar//EN\r\n";
        $ics .= "BEGIN:VEVENT\r\n";
        $ics .= "UID:event-" . $event->event_id . "@eventsphere.com\r\n";
        $ics .= "DTSTAMP:" . gmdate('Ymd\THis\Z') . "\r\n";
        $ics .= "DTSTART:$start\r\n";
        $ics .= "SUMMARY:" . addslashes($event->title) . "\r\n";
        $ics .= "DESCRIPTION:" . addslashes($description) . "\r\n";
        $ics .= "LOCATION:" . addslashes($event->venue ?? '') . "\r\n";
        $ics .= "END:VEVENT\r\nEND:VCALENDAR\r\n";

        return response($ics)
            ->header('Content-Type', 'text/calendar')
            ->header('Content-Disposition', "attachment; filename=event-{$event->event_id}.ics");
    }
}
