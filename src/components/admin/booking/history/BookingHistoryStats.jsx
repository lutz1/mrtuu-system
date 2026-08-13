import React from "react";
import styles from "./BookingHistoryStats.module.css";

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5.5a2 2 0 0 1 2-2h5.5v17H6a2 2 0 0 1-2-2v-13z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M20 5.5a2 2 0 0 0-2-2h-5.5v17H18a2 2 0 0 0 2-2v-13z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function BookingHistoryStats({ total, thisMonth }) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.iconCircle}>
          <BookIcon />
        </span>
        <div>
          <p className={styles.label}>Total Bookings</p>
          <p className={styles.value}>{total}</p>
        </div>
      </div>
      <div className={styles.card}>
        <span className={styles.iconCircle}>
          <CalendarIcon />
        </span>
        <div>
          <p className={styles.label}>This Month</p>
          <p className={styles.value}>{thisMonth}</p>
        </div>
      </div>
    </div>
  );
}