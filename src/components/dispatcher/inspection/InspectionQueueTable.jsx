import React from "react";
import styles from "./InspectionQueueTable.module.css";

export default function InspectionQueueTable({ bookings, onStartInspection }) {
  if (bookings.length === 0) {
    return <div className={styles.empty}>No bookings in this queue right now.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Pickup Date</th>
            <th>Return Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td className={styles.bookingId} data-label="Booking ID">{b.id}</td>
              <td data-label="Customer">
                <p className={styles.primaryText}>{b.customer}</p>
                <p className={styles.secondaryText}>{b.phone}</p>
              </td>
              <td data-label="Vehicle">
                <p className={styles.primaryText}>{b.vehicle}</p>
                <p className={styles.secondaryText}>{b.plate}</p>
              </td>
              <td data-label="Pickup Date">
                <p className={styles.primaryText}>{b.pickupDate}</p>
                <p className={styles.secondaryText}>{b.pickupTime}</p>
              </td>
              <td data-label="Return Date">
                <p className={styles.primaryText}>{b.returnDate}</p>
                <p className={styles.secondaryText}>{b.returnTime}</p>
              </td>
              <td className={styles.actionsCell}>
                {/* TODO: no inspection checklist screen exists yet */}
                <button type="button" className={styles.startBtn} onClick={() => onStartInspection(b)}>
                  Start Inspection
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}