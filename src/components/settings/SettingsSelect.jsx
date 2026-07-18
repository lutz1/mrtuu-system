import React from "react";
import styles from "./SettingsSelect.module.css";

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SettingsSelect({ label, value, options, onChange, labelClassName }) {
  return (
    <label className={styles.field}>
      <span className={labelClassName || styles.label}>{label}</span>
      <div className={styles.selectWrap}>
        <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron}>
          <ChevronIcon />
        </span>
      </div>
    </label>
  );
}