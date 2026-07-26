import styles from "./Loading.module.css";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
