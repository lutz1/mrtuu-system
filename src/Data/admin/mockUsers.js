// TODO: mock data — replace with real staff/user accounts once the admin
// data layer exists.
//
// NOTE: the reference design left rows 2-3 with a bare "@gmail.com" email
// (no name in front) and used an implausible year (2067) for Last Login —
// both corrected here, same as the Customers screen's mock data.

export const USER_ROLES = ["Admin", "Dispatcher"];
export const USER_STATUSES = ["Active", "Inactive"];

export const MOCK_USERS = [
  {
    id: "USR-001",
    name: "Selsite Nobleza",
    email: "selsite67@gmail.com",
    role: "Admin",
    status: "Active",
    lastLogin: "January 10, 2026 10:30 AM",
  },
  {
    id: "USR-002",
    name: "Leigh Carcallas",
    email: "leighcarcallas@gmail.com",
    role: "Dispatcher",
    status: "Active",
    lastLogin: "January 10, 2026 10:30 AM",
  },
  {
    id: "USR-003",
    name: "Hanni Pham",
    email: "hannipham@gmail.com",
    role: "Dispatcher",
    status: "Inactive",
    lastLogin: "January 10, 2026 10:30 AM",
  },
];