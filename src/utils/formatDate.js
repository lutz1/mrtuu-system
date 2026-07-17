// Formats an ISO date string range the way the bookings UI expects:
// "July 14 - July 17, 2067" or "February 14 - February 15, 2067"

export function formatDateRange(startISO, endISO) {
  const start = new Date(startISO);
  const end = new Date(endISO);

  const startMonth = start.toLocaleDateString("en-US", { month: "long" });
  const endMonth = end.toLocaleDateString("en-US", { month: "long" });
  const year = end.getFullYear();

  const startDay = start.getDate().toString().padStart(2, "0");
  const endDay = end.getDate().toString().padStart(2, "0");

  // Same month: "July 14 - 17, 2067" style is common, but the reference image
  // repeats the month on both sides ("July 14 - July 17, 2067"), so match that.
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

export function formatSingleDate(iso) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}