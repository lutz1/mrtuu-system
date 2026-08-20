import styles from "./StatusBadge.module.css";

// Maps a status string to a badge style. Add new statuses here as needed.
const VARIANTS = {
  Active: styles.success,
  Rented: styles.success,
  Paid: styles.success,
  Available: styles.neutral,
  Completed: styles.neutral,
  Pending: styles.neutral,
  Cancelled: styles.muted,
  Maintenance: styles.muted,
  Unavailable: styles.muted,
  Failed: styles.muted,
};

export default function StatusBadge({ status }) {
  const variant = VARIANTS[status] || styles.neutral;
  return <span className={`${styles.badge} ${variant}`}>{status}</span>;
}
