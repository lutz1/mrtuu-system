// TODO: mock data — replace with real aggregated reporting data once the
// admin data layer exists.

export const REPORT_PERIOD_LABEL = "July 20, 2026 - July 27, 2026";
export const COMPARISON_LABEL = "vs July 13 - July 19, 2026";

export const OVERVIEW_STATS = [
  { key: "revenue", label: "Total Revenue", value: "₱98,450", change: "+12.5%", direction: "up" },
  { key: "bookings", label: "Total Bookings", value: "42", change: "+8.2%", direction: "up" },
  { key: "carsRented", label: "Cars Rented", value: "36", change: "+5.6%", direction: "up" },
  { key: "newCustomers", label: "New Customers", value: "18", change: "+20.0%", direction: "up" },
  { key: "avgDailyRevenue", label: "Average Daily Revenue", value: "₱14,064", change: "+9.4%", direction: "up" },
];

export const REVENUE_TREND = [
  { date: "July 20", revenue: 16500 },
  { date: "July 21", revenue: 18000 },
  { date: "July 22", revenue: 21000 },
  { date: "July 23", revenue: 21500 },
  { date: "July 24", revenue: 19500 },
  { date: "July 25", revenue: 11000 },
];

export const BOOKINGS_TREND = [
  { date: "July 20", bookings: 56 },
  { date: "July 21", bookings: 64 },
  { date: "July 22", bookings: 76 },
  { date: "July 23", bookings: 78 },
  { date: "July 24", bookings: 70 },
  { date: "July 25", bookings: 37 },
];

// NOTE: the reference design repeated an identical revenue figure
// (₱26,400.00) across every row here regardless of booking count —
// not plausible as real data, so this varies revenue roughly in
// proportion to bookings instead.
export const REVENUE_BY_VEHICLE = [
  { vehicle: "Toyota Vios", bookings: 12, revenue: 43200 },
  { vehicle: "Toyota Raize", bookings: 9, revenue: 28800 },
  { vehicle: "Honda City", bookings: 7, revenue: 28000 },
  { vehicle: "Toyota Fortuner", bookings: 5, revenue: 27500 },
  { vehicle: "Suzuki Ertiga", bookings: 3, revenue: 10800 },
];

// NOTE: the reference design showed all five statuses at an identical
// "10 (10.67%)" — the counts didn't sum to the actual Total Bookings
// (42) and the percentages didn't sum to 100%. Corrected here so both
// reconcile.
export const BOOKING_STATUS_BREAKDOWN = [
  { label: "Pending Documents", count: 10, color: "#6366f1" },
  { label: "For Dispatcher", count: 8, color: "#22a35e" },
  { label: "Ready for Pickup", count: 9, color: "#f0a93a" },
  { label: "Completed", count: 11, color: "#22d3ee" },
  { label: "Cancelled", count: 4, color: "#a78bfa" },
];

export const TOTAL_BOOKINGS = BOOKING_STATUS_BREAKDOWN.reduce((sum, s) => sum + s.count, 0);

export const RECENT_REPORTS = [
  { id: 1, name: "Sales Report_July20 - July27, 2026", generatedAt: "July 27, 2026 10:00 AM" },
  { id: 2, name: "Bookings Report_July20 - July27, 2026", generatedAt: "July 27, 2026 10:00 AM" },
  { id: 3, name: "Vehicle Report_July20 - July27, 2026", generatedAt: "July 27, 2026 10:00 AM" },
  { id: 4, name: "Customer Report_July20 - July27, 2026", generatedAt: "July 27, 2026 10:00 AM" },
];