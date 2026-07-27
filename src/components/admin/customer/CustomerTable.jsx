import React from "react";
import CustomerStatusBadge from "./CustomerStatusBadge";
import CustomerRowActions from "./CustomerRowActions";
import styles from "./CustomerTable.module.css";

export default function CustomerTable({ customers, onToggleVerification }) {
  if (customers.length === 0) {
    return <div className={styles.empty}>No customers match your search or filters.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Driver's License</th>
            <th>Joined Date</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td className={styles.customerId}>{c.id}</td>
              <td className={styles.name}>{c.name}</td>
              <td className={styles.cell}>{c.phone}</td>
              <td className={styles.cell}>{c.email}</td>
              <td className={styles.cell}>{c.license}</td>
              <td className={styles.cell}>{c.joinedDate}</td>
              <td>
                <CustomerStatusBadge status={c.status} />
              </td>
              <td>
                <CustomerRowActions customer={c} onToggleVerification={onToggleVerification} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}