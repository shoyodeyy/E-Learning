// utils/shareLinks.js
export function generateShareLinks(event, baseUrl) {
  const resolvedEvent =
    event && typeof event === "object"
      ? event
      : { id: event };

  const eventId =
    resolvedEvent?.id ??
    resolvedEvent?.eventId ??
    resolvedEvent?.event_id ??
    resolvedEvent?.slug ??
    resolvedEvent?.slugId;

  const eventUrl = eventId ? `${baseUrl}/event/${eventId}` : baseUrl;

  const when = resolvedEvent?.date ? `${resolvedEvent.date}` : '';
  const where = resolvedEvent?.venue || resolvedEvent?.location || '';
  const message = `🎉 ${resolvedEvent?.title || 'Event'}\n${when ? `📅 ${when}` : ''} ${where ? `at ${where}` : ''}\n\n👉 View details: ${eventUrl}`.trim();

  return {
    facebook: {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`
    },
    whatsapp: {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(message)}`
    },
    linkedin: {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`
    },
    twitter: {
      name: "Twitter (X)",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
    },
    email: {
      name: "Email",
      url: `mailto:?subject=${encodeURIComponent("Event Invitation: " + (resolvedEvent?.title || "Event"))}&body=${encodeURIComponent(message)}`
    }
  };
}
