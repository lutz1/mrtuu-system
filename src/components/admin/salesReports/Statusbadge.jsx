import styles from "./StatusBadge.module.css";

// Maps a status string to a badge style. Add new statuses here as needed.
const VARIANTS = {
  Active: styles.success,
  Paid: styles.success,
  Completed: styles.neutral,
  Pending: styles.neutral,
  Cancelled: styles.muted,
  Failed: styles.muted,
  // vehicle statuses
  Available: styles.available,
  Rented: styles.rented,
  Maintenance: styles.maintenance,
  Unavailable: styles.unavailable,
};

export default function StatusBadge({ status }) {
  const variant = VARIANTS[status] || styles.neutral;
  return <span className={`${styles.badge} ${variant}`}>{status}</span>;
}
