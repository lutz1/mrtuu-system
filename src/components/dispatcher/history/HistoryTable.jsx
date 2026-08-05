import React from "react";
import InspectionStatusBadge from "./InspectionStatusBadge";
import styles from "./HistoryTable.module.css";

export default function HistoryTable({ entries, onViewDetails }) {
  if (entries.length === 0) {
    return <div className={styles.empty}>No inspection history matches your search or filter.</div>;
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
            <th>Inspected On</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <td className={styles.bookingId}>{e.id}</td>
              <td className={styles.primaryText}>{e.customer}</td>
              <td>
                <p className={styles.primaryText}>{e.vehicle}</p>
                <p className={styles.secondaryText}>{e.plate}</p>
              </td>
              <td>
                <p className={styles.primaryText}>{e.pickupDate}</p>
                <p className={styles.secondaryText}>{e.pickupTime}</p>
              </td>
              <td>
                <p className={styles.primaryText}>{e.returnDate}</p>
                <p className={styles.secondaryText}>{e.returnTime}</p>
              </td>
              <td>
                <p className={styles.primaryText}>{e.inspectedOn}</p>
                <p className={styles.secondaryText}>{e.inspectedTime}</p>
              </td>
              <td>
                <InspectionStatusBadge status={e.status} />
              </td>
              <td>
                {/* TODO: no inspection-details view exists yet */}
                <button type="button" className={styles.viewBtn} onClick={() => onViewDetails(e)}>
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