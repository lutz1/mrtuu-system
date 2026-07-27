import React from "react";
import styles from "./CustomerStatCard.module.css";

export default function CustomerStatCard({ icon, label, value }) {
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