import React from "react";
import styles from "./UserStatCard.module.css";

export default function UserStatCard({ icon, label, value }) {
  return (
    <div className={styles.card}>
      <span className={styles.iconCircle}>{icon}</span>
      <div>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
}