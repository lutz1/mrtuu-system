import React from "react";
import styles from "./BookingFilterTabs.module.css";

const TABS = ["All", "Pending Documents", "For Dispatcher", "Ready for Pickup", "Completed", "Cancelled"];

export default function BookingFilterTabs({ active, onChange }) {
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