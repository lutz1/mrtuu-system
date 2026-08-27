import styles from "./InspectionStatusBadge.module.css";

const STATUS_CLASS = {
  Cleared: "cleared",
  "Sent to Admin": "sentToAdmin",
  Returned: "returned",
};

export default function InspectionStatusBadge({ status }) {
  const className = STATUS_CLASS[status] || "cleared";
  return (
    <span className={`${styles.badge} ${styles[className]}`}>
      <span className={styles.dot} />
      {status}
    </span>
  );
}