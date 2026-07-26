import React from "react";
import BookingStatusBadge from "./BookingStatusBadge";
import styles from "./BookingsTable.module.css";

export default function BookingsTable({ bookings, onView }) {
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
            <th>Rental Date</th>
            <th>Return Date</th>
            <th>Total Amount</th>
            <th>Status</th>
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
                <p className={styles.primaryText}>{b.rentalDate}</p>
                <p className={styles.secondaryText}>{b.rentalTime}</p>
              </td>
              <td>
                <p className={styles.primaryText}>{b.returnDate}</p>
                <p className={styles.secondaryText}>{b.returnTime}</p>
              </td>
              <td className={styles.amount}>₱{b.amount.toLocaleString()}.00</td>
              <td>
                <BookingStatusBadge status={b.status} />
              </td>
              <td>
                {/* TODO: wire to a real booking-details view once it exists */}
                <button
                  type="button"
                  className={styles.viewBtn}
                  onClick={() => onView?.(b)}
                  aria-label={`View ${b.id}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}