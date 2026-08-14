import React from "react";
import CustomerStatusBadge from "./CustomerStatusBadge";
import CustomerRowActions from "./CustomerRowActions";
import styles from "./CustomerTable.module.css";

export default function CustomerTable({
  customers,
  onToggleVerification,
}) {
  if (customers.length === 0) {
    return (
      <div className={styles.empty}>
        No customers match your search or filters.
      </div>
    );
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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              {/* Customer ID */}
              <td className={styles.customerId}>
                {c.id}
              </td>

              {/* Customer */}
              <td className={styles.name}>
                {c.name}
              </td>

              {/* Contact */}
              <td className={styles.cell}>
                {c.phone}
              </td>

              {/* Email */}
              <td className={styles.cell}>
                {c.email}
              </td>

              {/* Driver's License */}
              <td className={styles.cell}>
                {c.license}
              </td>

              {/* Joined Date */}
              <td className={styles.cell}>
                {c.joinedDate}
              </td>

              {/* Status */}
              <td className={styles.statusCell}>
                <CustomerStatusBadge status={c.status} />
              </td>

              {/* Actions */}
              <td className={styles.actionsCell}>
                <CustomerRowActions
                  customer={c}
                  onToggleVerification={onToggleVerification}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}