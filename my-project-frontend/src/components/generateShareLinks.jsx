// utils/shareLinks.js
export function generateShareLinks(event, baseUrl) {
  const eventUrl = `${baseUrl}/events/${event.id}`;
  const message = `🎉 ${event.title}\n📅 ${event.date} at ${event.venue}\n\n👉 Register here: ${eventUrl}`;

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
