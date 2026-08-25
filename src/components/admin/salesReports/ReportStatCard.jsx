import styles from "./ReportStatCard.module.css";

function UpArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 16l6-8 6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8l6 8 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ReportStatCard({ icon, label, value, change, direction, comparisonLabel }) {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.iconCircle}>{icon}</span>
      </div>
      <p className={styles.value}>{value}</p>
      <p className={`${styles.change} ${direction === "down" ? styles.changeDown : styles.changeUp}`}>
        {direction === "down" ? <DownArrow /> : <UpArrow />}
        {change} {comparisonLabel}
      </p>
    </div>
  );
}