import styles from "./BookingStatusBadge.module.css";

const STATUS_DOT_CLASS = {
  "Pending Documents": "dotNeutral",
  "For Dispatcher": "dotBlue",
  "Ready for Pickup": "dotGold",
  Completed: "dotGreen",
  Cancelled: "dotRed",
};

export default function BookingStatusBadge({ status }) {
  const dotClass = STATUS_DOT_CLASS[status] || "dotNeutral";
  return (
    <span className={styles.badge}>
      <span className={`${styles.dot} ${styles[dotClass]}`} />
      {status}
    </span>
  );
}