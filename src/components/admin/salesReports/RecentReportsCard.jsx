import React from "react";
import styles from "./RecentReportsCard.module.css";

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19V5a1.5 1.5 0 0 1 1.5-1.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 3.5V8h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4v11M8 11l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function RecentReportsCard({ reports, onDownload }) {
  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Recent Reports</h2>
        {/* TODO: link to a real full reports-history view once it exists */}
        <button type="button" className={styles.viewAllBtn}>
          View All
        </button>
      </div>

      <ul className={styles.list}>
        {reports.map((report) => (
          <li key={report.id} className={styles.row}>
            <span className={styles.icon}>
              <DocIcon />
            </span>
            <div className={styles.info}>
              <p className={styles.name}>{report.name}</p>
              <p className={styles.date}>{report.generatedAt}</p>
            </div>
            {/* TODO: wire to a real file download once report generation exists */}
            <button
              type="button"
              className={styles.downloadBtn}
              onClick={() => onDownload(report)}
              aria-label={`Download ${report.name}`}
            >
              <DownloadIcon />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}