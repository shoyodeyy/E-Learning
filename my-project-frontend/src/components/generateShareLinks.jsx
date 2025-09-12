// utils/shareLinks.js
export function generateShareLinks(event, baseUrl) {
  const eventUrl = `${baseUrl}/event/${event?.id}`;
  const when = event?.date ? `${event.date}` : '';
  const where = event?.venue || event?.location || '';
  const message = `🎉 ${event?.title || 'Event'}\n${when ? `📅 ${when}` : ''} ${where ? `at ${where}` : ''}\n\n👉 View details: ${eventUrl}`.trim();

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
      url: `mailto:?subject=${encodeURIComponent("Event Invitation: " + event.title)}&body=${encodeURIComponent(message)}`
    }
  };
}
