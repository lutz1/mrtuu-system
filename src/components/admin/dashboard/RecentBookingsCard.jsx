import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import styles from "./RecentBookingsCard.module.css";

const STATUS_CLASS = {
  "Pending Docs": "statusNeutral",
  "For Inspection": "statusNeutral",
  "Ready for Pickup": "statusGold",
  Completed: "statusGreen",
  Cancelled: "statusNeutral",
};

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(d) {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Maps a raw booking doc to the display status this card shows.
function deriveDisplayStatus(booking) {
  if (booking.status === "cancelled") return "Cancelled";
  if (booking.status === "completed") return "Completed";
  if (booking.status === "ongoing") return "Ready for Pickup";
  if (booking.clearance?.status === "cleared") return "For Inspection";
  return "Pending Docs";
}

export default function RecentBookingsCard() {
  const { bookings, loading } = useAdminBookings();

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          (toDate(b.createdAt)?.getTime() || 0) -
          (toDate(a.createdAt)?.getTime() || 0)
      )
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        name: b.customer,
        vehicle: b.vehicle,
        date: formatDate(toDate(b.createdAt)),
        status: deriveDisplayStatus(b),
      }));
  }, [bookings]);

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Recent Bookings</h2>

      {loading ? (
        <p className={styles.date}>Loading recent bookings…</p>
      ) : recentBookings.length === 0 ? (
        <p className={styles.date}>No bookings yet.</p>
      ) : (
        <ul className={styles.list}>
          {recentBookings.map((b) => (
            <li key={b.id} className={styles.row}>
              <span className={styles.thumb} aria-hidden="true" />

              <div className={styles.info}>
                <p className={styles.bookingId}>{b.id}</p>
                <p className={styles.name}>{b.name}</p>
                <p className={styles.vehicle}>{b.vehicle}</p>
                <p className={styles.date}>{b.date}</p>
              </div>

              <span
                className={`${styles.statusBadge} ${
                  styles[STATUS_CLASS[b.status]]
                }`}
              >
                {b.status}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Link to="/admin/bookings" className={styles.viewAllLink}>
        View all bookings
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </section>
  );
}
