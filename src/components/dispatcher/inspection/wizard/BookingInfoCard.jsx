import React from "react";
import styles from "./BookingInfoCard.module.css";

export default function BookingInfoCard({ booking }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Booking Information</h2>

      <div className={styles.field}>
        <p className={styles.label}>Booking ID</p>
        <p className={styles.value}>{booking.id}</p>
      </div>
      <div className={styles.field}>
        <p className={styles.label}>Customer</p>
        <p className={styles.value}>{booking.customer}</p>
      </div>
      <div className={styles.field}>
        <p className={styles.label}>Vehicle</p>
        <p className={styles.value}>{booking.vehicle}</p>
      </div>
      <div className={styles.field}>
        <p className={styles.label}>Date &amp; Time</p>
        <p className={styles.value}>
          {booking.pickupDate} • {booking.pickupTime}
        </p>
      </div>
    </div>
  );
}