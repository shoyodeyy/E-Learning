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

        $startLocalStr = (clone $startLocal)->format('Ymd\THis');
        $endLocalStr = (clone $endLocal)->format('Ymd\THis');

        $description = $event->description ? strip_tags($event->description) : '';

        $rawTitle = $event->title ?: ("event-" . $event->event_id);
        $safeTitle = preg_replace('/[\x00-\x1F\x7F<>:\"\\\\\/\|\?\*]+/u', '_', $rawTitle);
        $filename = trim($safeTitle) !== '' ? ($safeTitle . '.ics') : ("event-{$event->event_id}.ics");

        $googleUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE"
            . "&text=" . urlencode($event->title)
            . "&dates={$startLocalStr}/{$endLocalStr}"
            . "&details=" . urlencode($description)
            . "&location=" . urlencode($event->venue ?? '')
            . "&sf=true&output=xml";

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

        // Use same safe filename logic here as well
        $rawTitle = $event->title ?: ("event-" . $event->event_id);
        $safeTitle = preg_replace('/[\x00-\x1F\x7F<>:\"\\\\\/\|\?\*]+/u', '_', $rawTitle);
        $filename = trim($safeTitle) !== '' ? ($safeTitle . '.ics') : ("event-{$event->event_id}.ics");

        return response($ics)
            ->header('Content-Type', 'text/calendar; charset=utf-8')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }
}
