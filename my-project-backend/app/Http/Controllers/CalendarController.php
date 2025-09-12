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

        // Treat DB times as local wall time of the event; do not shift by user timezone.
        // We only use the numeric fields from event as-is.
        $startLocal = $event->start_at instanceof Carbon
            ? (clone $event->start_at)
            : Carbon::parse($event->start_at);
        // Prefer model accessor end_at if available; otherwise derive from duration
        $endAttr = $event->getAttribute('end_at');
        if ($endAttr instanceof Carbon) {
            $endLocal = (clone $endAttr);
        } else {
            $duration = (int)($event->duration_minutes ?? 60);
            $endLocal = (clone $startLocal)->addMinutes(max($duration, 1));
        }

        // Use event-local wall time for Google Calendar (no timezone param)
        $startLocalStr = (clone $startLocal)->format('Ymd\THis');
        $endLocalStr = (clone $endLocal)->format('Ymd\THis');

        $description = $event->description ? strip_tags($event->description) : '';

        $googleUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE"
            . "&text=" . urlencode($event->title)
            . "&dates={$startLocalStr}/{$endLocalStr}"
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

        // Treat DB times as local wall time of the event; do not shift by user timezone.
        $startLocal = $event->start_at instanceof Carbon
            ? (clone $event->start_at)
            : Carbon::parse($event->start_at);
        $endAttr = $event->getAttribute('end_at');
        if ($endAttr instanceof Carbon) {
            $endLocal = (clone $endAttr);
        } else {
            $duration = (int)($event->duration_minutes ?? 60);
            $endLocal = (clone $startLocal)->addMinutes(max($duration, 1));
        }

        // Use event-local wall time without TZ (floating) to keep exact numbers
        $dtstartLocal = (clone $startLocal)->format('Ymd\THis');
        $dtendLocal = (clone $endLocal)->format('Ymd\THis');

        $description = $event->description ? strip_tags($event->description) : '';

        $ics = "BEGIN:VCALENDAR\r\n";
        $ics .= "VERSION:2.0\r\n";
        $ics .= "PRODID:-//EventSphere//Calendar//EN\r\n";
        $ics .= "CALSCALE:GREGORIAN\r\n";
        $ics .= "METHOD:PUBLISH\r\n";
        $ics .= "BEGIN:VEVENT\r\n";
        $ics .= "UID:event-" . $event->event_id . "@eventsphere.com\r\n";
        $ics .= "DTSTAMP:" . gmdate('Ymd\THis\Z') . "\r\n";
        $ics .= "DTSTART:$dtstartLocal\r\n";
        $ics .= "DTEND:$dtendLocal\r\n";
        $ics .= "SUMMARY:" . addslashes($event->title) . "\r\n";
        $ics .= "DESCRIPTION:" . addslashes($description) . "\r\n";
        $ics .= "LOCATION:" . addslashes($event->venue ?? '') . "\r\n";
        $ics .= "END:VEVENT\r\nEND:VCALENDAR\r\n";

        return response($ics)
            ->header('Content-Type', 'text/calendar')
            ->header('Content-Disposition', "attachment; filename=event-{$event->event_id}.ics");
    }
}
