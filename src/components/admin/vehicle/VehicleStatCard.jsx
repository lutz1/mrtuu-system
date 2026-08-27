import styles from "./VehicleStatCard.module.css";

export default function VehicleStatCard({ icon, label, value }) {
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