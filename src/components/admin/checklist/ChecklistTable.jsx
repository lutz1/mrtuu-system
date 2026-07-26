import React from "react";
import styles from "./ChecklistTable.module.css";

export default function ChecklistTable({ title, entries, selectedId, onSelect }) {
  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.countBadge}>{entries.length}</span>
      </div>

      {entries.length === 0 ? (
        <p className={styles.empty}>No bookings in this status.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Rental Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className={entry.id === selectedId ? styles.rowSelected : undefined}>
                  <td className={styles.bookingId}>{entry.id}</td>
                  <td>
                    <p className={styles.primaryText}>{entry.customer}</p>
                    <p className={styles.secondaryText}>{entry.phone}</p>
                  </td>
                  <td>
                    <p className={styles.primaryText}>{entry.vehicle}</p>
                    <p className={styles.secondaryText}>{entry.plate}</p>
                  </td>
                  <td>
                    <p className={styles.primaryText}>{entry.rentalDate}</p>
                    <p className={styles.secondaryText}>{entry.rentalTime}</p>
                  </td>
                  <td className={styles.statusText}>Pending</td>
                  <td>
                    <button
                      type="button"
                      className={styles.viewBtn}
                      onClick={() => onSelect(entry.id)}
                      aria-label={`View ${entry.id}`}
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
      )}

      <p className={styles.summary}>
        Showing {entries.length === 0 ? 0 : 1} to {entries.length} of {entries.length} entries
      </p>
    </section>
  );
}