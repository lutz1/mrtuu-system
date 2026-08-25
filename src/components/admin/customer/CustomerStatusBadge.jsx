import styles from "./CustomerStatusBadge.module.css";

export default function CustomerStatusBadge({ status }) {
  const isVerified = status === "Verified";
  return (
    <span className={`${styles.badge} ${isVerified ? styles.verified : styles.unverified}`}>
      <span className={styles.dot} />
      {status}
    </span>
  );
}