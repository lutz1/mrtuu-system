import React from "react";
import styles from "./RecentBookingsCard.module.css";
import { Link } from "react-router-dom";

// TODO: mock data — swap for real recent bookings once available.
const BOOKINGS = [
  { id: "#BK-1024", name: "Juan Dela Cruz", vehicle: "Toyota Vios", date: "May 26, 2026", status: "Pending Docs" },
  { id: "#BK-1023", name: "Tortskie Joe", vehicle: "Toyota Fortuner", date: "May 25, 2026", status: "For Inspection" },
  { id: "#BK-1022", name: "Ram Boy", vehicle: "Ford Everest", date: "May 24, 2026", status: "Ready for Pickup" },
  { id: "#BK-1021", name: "Leigh Co", vehicle: "Suzuki Swift", date: "May 24, 2026", status: "Completed" },
  { id: "#BK-1020", name: "Mark Silaya", vehicle: "Mitsubishi Xpander", date: "May 23, 2026", status: "Cancelled" },
];

const STATUS_CLASS = {
  "Pending Docs": "statusNeutral",
  "For Inspection": "statusNeutral",
  "Ready for Pickup": "statusGold",
  Completed: "statusGreen",
  Cancelled: "statusNeutral",
};

export default function RecentBookingsCard() {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Recent Bookings</h2>

      <ul className={styles.list}>
        {BOOKINGS.map((b) => (
          <li key={b.id} className={styles.row}>
            <span className={styles.thumb} aria-hidden="true" />

            <div className={styles.info}>
              <p className={styles.bookingId}>{b.id}</p>
              <p className={styles.name}>{b.name}</p>
              <p className={styles.vehicle}>{b.vehicle}</p>
              <p className={styles.date}>{b.date}</p>
            </div>

            <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[b.status]]}`}>{b.status}</span>
          </li>
        ))}
      </ul>

      {/* TODO: link to a real bookings list page once it exists */}
      <Link to="/admin/bookings" href="#" className={styles.viewAllLink}>
        View all bookings
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </section>
  );
}