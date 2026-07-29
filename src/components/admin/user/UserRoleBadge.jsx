import React from "react";
import styles from "./UserRoleBadge.module.css";

export default function UserRoleBadge({ role }) {
  const isAdmin = role === "Admin";
  return (
    <span className={`${styles.badge} ${isAdmin ? styles.admin : styles.dispatcher}`}>
      {isAdmin && <span className={styles.dot} />}
      {role}
    </span>
  );
}