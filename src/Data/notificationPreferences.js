// Mock notification preferences — swap with real Firestore data later,
// keyed by uid under something like users/{uid}/notificationPreferences.

export const NOTIFICATION_CHANNELS = ["email", "sms", "push"];

export const NOTIFICATION_CATEGORIES = [
  {
    id: "bookingUpdates",
    icon: "bookmark",
    title: "Booking Updates",
    description: "Stay updated on your rental status and pickup instructions.",
    channels: { email: true, sms: true, push: true },
  },
  {
    id: "promotionsNews",
    icon: "sparkle",
    title: "Promotions & News",
    description: "Be the first to hear about unit additions and seasonal discounts.",
    channels: { email: true, sms: false, push: false },
  },
  {
    id: "rentalReminders",
    icon: "calendar",
    title: "Rental Reminders",
    description: "Reminders for upcoming returns, document expirations, and inspections.",
    channels: { email: true, sms: false, push: true },
  },
];