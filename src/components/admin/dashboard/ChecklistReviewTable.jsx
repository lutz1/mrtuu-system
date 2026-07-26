import React from "react";
import styles from "./ChecklistReviewTable.module.css";

// TODO: mock data — swap for real checklist entries once available.
const CHECKLIST = [
  { id: "#BK-1024", customer: "Juan Dela Cruz", vehicle: "Toyota Vios", docStatus: "2/4 Uploaded", date: "May 26, 2026" },
  { id: "#BK-1023", customer: "Tortskie Joe", vehicle: "Toyota Fortuner", docStatus: "Complete", date: "May 25, 2026" },
  { id: "#BK-1022", customer: "Ramboy", vehicle: "Ford Everest", docStatus: "3/4 Uploaded", date: "May 25, 2026" },
  { id: "#BK-1021", customer: "Leigh Co", vehicle: "Suzuki Swift", docStatus: "1/4 Uploaded", date: "May 24, 2026" },
];

export default function ChecklistReviewTable() {
  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Checklist to Review</h2>
        {/* TODO: link to a real full checklist page once it exists */}
        <button type="button" className={styles.viewAllBtn}>
          View All
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Document Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {CHECKLIST.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.customer}</td>
                <td>{row.vehicle}</td>
                <td className={row.docStatus === "Complete" ? styles.docComplete : undefined}>{row.docStatus}</td>
                <td>{row.date}</td>
                <td>
                  {/* TODO: wire to a real review flow once it exists */}
                  <button type="button" className={styles.reviewBtn}>
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}