import styles from "./UpcomingPickupsCard.module.css";

export default function UpcomingPickupsCard({ pickups, onViewAll }) {
  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Upcoming Pickups</h2>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.calendarIcon}>
          <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </div>

      <div className={styles.list}>
        {pickups.map((p) => (
          <div key={p.id} className={styles.item}>
            <span className={styles.time}>{p.pickupTime}</span>
            <div className={styles.info}>
              <p className={styles.customer}>{p.id}</p>
              <p className={styles.details}>{p.customer}</p>
              <p className={styles.details}>{p.vehicle}</p>
            </div>
            <span className={styles.todayTag}>Today</span>
          </div>
        ))}
      </div>

      <button type="button" className={styles.viewAllLink} onClick={onViewAll}>
        View all pickups
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}