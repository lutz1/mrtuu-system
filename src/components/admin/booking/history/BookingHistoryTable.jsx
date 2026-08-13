import React from "react";
import styles from "./BookingHistoryTable.module.css";

export default function BookingHistoryTable({ bookings, onViewDetails }) {
  if (bookings.length === 0) {
    return <div className={styles.empty}>No bookings match your search or filter.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Rental Period</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td className={styles.bookingId}>{b.id}</td>
              <td>
                <p className={styles.primaryText}>{b.customer}</p>
                <p className={styles.secondaryText}>{b.phone}</p>
              </td>
              <td>
                <p className={styles.primaryText}>{b.vehicle}</p>
                <p className={styles.secondaryText}>{b.plate}</p>
              </td>
              <td>
                <p className={styles.primaryText}>
                  {b.pickupDateDisplay} - {b.returnDateDisplay}
                </p>
                <p className={styles.secondaryText}>{b.days ?? 1} Days</p>
              </td>
              <td className={styles.amount}>₱{(b.total ?? 0).toLocaleString()}.00</td>
              <td>
                <button type="button" className={styles.viewBtn} onClick={() => onViewDetails(b)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}