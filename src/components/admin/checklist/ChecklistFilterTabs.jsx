import React from "react";
import styles from "./ChecklistFilterTabs.module.css";

const TABS = ["Pending Documents", "For Dispatcher", "Cleared / Completed", "Rejected"];

export default function ChecklistFilterTabs({ active, onChange }) {
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