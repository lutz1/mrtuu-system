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
              <td className={styles.bookingId} data-label="Booking ID">{e.id}</td>
              <td className={styles.primaryText} data-label="Customer">{e.customer}</td>
              <td data-label="Vehicle">
                <p className={styles.primaryText}>{e.vehicle}</p>
                <p className={styles.secondaryText}>{e.plate}</p>
              </td>
              <td data-label="Pickup Date">
                <p className={styles.primaryText}>{e.pickupDate}</p>
                <p className={styles.secondaryText}>{e.pickupTime}</p>
              </td>
              <td data-label="Return Date">
                <p className={styles.primaryText}>{e.returnDate}</p>
                <p className={styles.secondaryText}>{e.returnTime}</p>
              </td>
              <td data-label="Inspected On">
                <p className={styles.primaryText}>{e.inspectedOn}</p>
                <p className={styles.secondaryText}>{e.inspectedTime}</p>
              </td>
              <td data-label="Status">
                <InspectionStatusBadge status={e.status} />
              </td>
              <td className={styles.actionsCell}>
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