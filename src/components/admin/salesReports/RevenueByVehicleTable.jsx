import React from "react";
import styles from "./RevenueByVehicleTable.module.css";

export default function RevenueByVehicleTable({ rows }) {
  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Revenue Overview</h2>
        {/* TODO: link to a real full revenue-by-vehicle report once it exists */}
        <button type="button" className={styles.viewAllBtn}>
          View All
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Bookings</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.vehicle}>
              <td className={styles.vehicleName}>{row.vehicle}</td>
              <td>{row.bookings}</td>
              <td className={styles.revenue}>₱{row.revenue.toLocaleString()}.00</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}