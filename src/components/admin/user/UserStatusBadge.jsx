import styles from "./UserStatusBadge.module.css";

export default function UserStatusBadge({ active }) {
  return (
    <span
      className={`${styles.badge} ${active ? styles.active : styles.inactive}`}
    >
      <span className={styles.dot} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
