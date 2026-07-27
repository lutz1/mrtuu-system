import React from "react";
import styles from "./ReportToolbar.module.css";

export default function ReportToolbar({ periodLabel, onExport }) {
  return (
    <div className={styles.row}>
      {/* TODO: wire to a real date-range picker once one exists */}
      <button type="button" className={styles.dateBtn}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {periodLabel}
        <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* TODO: wire to real export (CSV/PDF) once available */}
      <button type="button" className={styles.exportBtn} onClick={onExport}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15V4M8 8l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Export Report
      </button>
    </div>
  );
}