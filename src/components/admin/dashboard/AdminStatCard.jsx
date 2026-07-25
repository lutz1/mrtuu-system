import React from "react";
import styles from "./AdminStatCard.module.css";

export default function AdminStatCard({ icon, label, value, footnote }) {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.iconCircle}>{icon}</span>
      </div>
      <p className={styles.value}>{value}</p>
      <p className={styles.footnote}>{footnote}</p>
    </div>
  );
}