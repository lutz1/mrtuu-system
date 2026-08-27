import styles from "./ReportTabs.module.css";

const TABS = ["Overview", "Sales Report", "Bookings Report", "Vehicle Report", "Customer Report", "Payment Report"];

export default function ReportTabs({ active, onChange }) {
  return (
    <div className={styles.tabs}>
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`${styles.tab} ${active === tab ? styles.tabActive : ""}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}