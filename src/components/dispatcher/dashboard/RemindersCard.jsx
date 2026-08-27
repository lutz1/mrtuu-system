import styles from "./RemindersCard.module.css";

const REMINDERS = [
  { key: "clean", title: "Ensure vehicle is clean", text: "Check cleanliness before inspection.", icon: "car" },
  { key: "fuel", title: "Check fuel level", text: "Record the accurate fuel level.", icon: "fuel" },
  { key: "docs", title: "Verify Documents", text: "Confirm OR/CR and license", icon: "docs" },
];

function ReminderIcon({ name }) {
  if (name === "car") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 15l1.5-5A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="15" width="18" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === "fuel") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4.5" y="4" width="9" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M13.5 9h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V9l-2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3.5" width="16" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8.5h8M8 12.5h8M8 16.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function RemindersCard() {
  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Reminders</h2>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.bellIcon}>
          <path d="M6 10a6 6 0 1 1 12 0c0 3.5 1 5 1.5 5.5H4.5C5 15 6 13.5 6 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9.5 18.5a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      <div className={styles.list}>
        {REMINDERS.map((r) => (
          <div key={r.key} className={styles.item}>
            <span className={styles.icon}>
              <ReminderIcon name={r.icon} />
            </span>
            <div>
              <p className={styles.itemTitle}>{r.title}</p>
              <p className={styles.itemText}>{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}