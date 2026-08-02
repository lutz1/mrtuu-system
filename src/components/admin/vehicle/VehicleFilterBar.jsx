import React from "react";
import styles from "./VehicleFilterBar.module.css";
import { VEHICLE_STATUSES, VEHICLE_TYPES } from "../../../data/admin/mockVehicles";

const STATUS_OPTIONS = ["All Status", ...VEHICLE_STATUSES];
const TYPE_OPTIONS = ["All Types", ...VEHICLE_TYPES];
const TRANSMISSION_OPTIONS = ["Transmission", "Automatic", "Manual"];

export default function VehicleFilterBar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
  transmission,
  onTransmissionChange,
  onAddVehicle,
  onDrafts,
  onArchive,
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.controlsRow}>
        <div className={styles.selectsGroup}>
          <select
            className={styles.select}
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={transmission}
            onChange={(e) => onTransmissionChange(e.target.value)}
          >
            {TRANSMISSION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {/* TODO: wire to a real advanced-filter panel once criteria are defined */}
          <button type="button" className={styles.moreFiltersBtn}>
            More Filters
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6h16M7 12h10M10 18h4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.actionsGroup}>
          {/* TODO: no Drafts screen exists yet — placeholder action */}
          <button type="button" className={styles.darkBtn} onClick={onDrafts}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 7h16M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Drafts
          </button>

          <button type="button" className={styles.darkBtn} onClick={onArchive}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3.5"
                y="5"
                width="17"
                height="4"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M10 13h4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            Archive
          </button>

          <button type="button" className={styles.addBtn} onClick={onAddVehicle}>
            <span className={styles.addIcon}>+</span>
            Add Vehicle
          </button>
        </div>
      </div>

      <div className={styles.searchRow}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M20 20l-3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search vehicle (name, brand)"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
    </div>
  );
}