import React from "react";
import styles from "./UserStatusBadge.module.css";

export default function UserStatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span className={`${styles.badge} ${isActive ? styles.active : styles.inactive}`}>
      <span className={styles.dot} />
      {status}
    </span>
  );
}