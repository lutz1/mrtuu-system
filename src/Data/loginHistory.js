// Mock session + security log data — swap with real Firestore data later,
// keyed under something like users/{uid}/sessions and users/{uid}/securityLog.

export const ACTIVE_SESSIONS = [
  {
    id: "session_001",
    device: "Windows PC • Chrome",
    location: "Apokon, Tagum City",
    lastActive: "Active Now",
    isCurrent: true,
    deviceType: "desktop",
  },
  {
    id: "session_002",
    device: "Samsung s24 Amar",
    location: "Buhangin, Davao City",
    lastActive: "2 hours ago",
    isCurrent: false,
    deviceType: "mobile",
  },
];

export const SECURITY_LOG = [
  { id: "log_001", label: "Password Changed", timestamp: "2067-07-12T14:30:00" },
  { id: "log_002", label: "New login from Apokon, Tagum City", timestamp: "2067-07-10T09:12:00" },
];