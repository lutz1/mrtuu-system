import React from "react";
import styles from "./ThemeOptionCard.module.css";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export default function ThemeOptionCard({ mode, selected, onSelect }) {
  const isDark = mode === "dark";

  return (
    <button
      type="button"
      className={`${styles.card} ${isDark ? styles.darkCard : styles.lightCard} ${selected ? styles.selected : ""}`}
      onClick={() => onSelect(mode)}
    >
      <span className={styles.icon}>{isDark ? <MoonIcon /> : <SunIcon />}</span>
      <span className={styles.label}>{isDark ? "Dark Mode" : "Light Mode"}</span>
    </button>
  );
}