import React from "react";
import styles from "./ArchivedVehicleFilterBar.module.css";
import { VEHICLE_STATUSES, VEHICLE_TYPES } from "../../../../data/admin/mockVehicles";

const STATUS_OPTIONS = ["All Status", ...VEHICLE_STATUSES];
const TYPE_OPTIONS = ["All Types", ...VEHICLE_TYPES];
const TRANSMISSION_OPTIONS = ["Transmission", "Automatic", "Manual"];

export default function ArchivedVehicleFilterBar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
  transmission,
  onTransmissionChange,
}) {
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
          placeholder="Search archived vehicles (name, brand, plate no.)"
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

      <select className={styles.select} value={type} onChange={(e) => onTypeChange(e.target.value)}>
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select className={styles.select} value={transmission} onChange={(e) => onTransmissionChange(e.target.value)}>
        {TRANSMISSION_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* TODO: wire to a real advanced-filter panel once criteria are defined */}
      <button type="button" className={styles.moreFiltersBtn}>
        More Filters
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}