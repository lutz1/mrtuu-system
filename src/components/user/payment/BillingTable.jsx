import React from "react";
import styles from "./BillingTable.module.css";

const STATUS_LABELS = {
  successful: "Successful",
  failed: "Failed",
  pending: "Pending",
};

function formatBillingDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

export default function BillingTable({ entries }) {
  if (!entries.length) {
    return <p className={styles.empty}>No billing history yet.</p>;
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{formatBillingDate(entry.date)}</td>
                <td>{entry.description}</td>
                <td>{entry.method}</td>
                <td>₱{entry.amount.toLocaleString("en-PH")}</td>
                <td>
                  <span className={`${styles.statusPill} ${styles[entry.status] || ""}`}>
                    {STATUS_LABELS[entry.status] || entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className={styles.cardList}>
        {entries.map((entry) => (
          <div key={entry.id} className={styles.billingCard}>
            <div className={styles.billingCardTop}>
              <span className={styles.billingDate}>{formatBillingDate(entry.date)}</span>
              <span className={`${styles.statusPill} ${styles[entry.status] || ""}`}>
                {STATUS_LABELS[entry.status] || entry.status}
              </span>
            </div>
            <p className={styles.billingDescription}>{entry.description}</p>
            <div className={styles.billingCardBottom}>
              <span>{entry.method}</span>
              <span className={styles.billingAmount}>₱{entry.amount.toLocaleString("en-PH")}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}