import React from "react";
import styles from "./CustomerFilterBar.module.css";
import { CUSTOMER_STATUSES } from "../../../data/admin/mockCustomers";

const STATUS_OPTIONS = ["All Status", ...CUSTOMER_STATUSES];
const SORT_OPTIONS = ["All", "Newest First", "Oldest First", "Name (A-Z)"];

export default function CustomerFilterBar({ query, onQueryChange, status, onStatusChange, sort, onSortChange, onExport }) {
  return (
    <div className={styles.row}>
      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search customer name, email..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <select className={styles.select} value={status} onChange={(e) => onStatusChange(e.target.value)}>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select className={styles.select} value={sort} onChange={(e) => onSortChange(e.target.value)}>
        {SORT_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* TODO: wire to a real advanced-filter panel once criteria are defined */}
      <button type="button" className={styles.filterBtn}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Filter
      </button>

      {/* TODO: wire to real export (CSV/PDF) once available */}
      <button type="button" className={styles.exportBtn} onClick={onExport}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15V4M8 8l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Export
      </button>
    </div>
  );
}