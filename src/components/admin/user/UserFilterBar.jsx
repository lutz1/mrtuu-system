import React from "react";
import styles from "./UserFilterBar.module.css";
import { USER_ROLES, USER_STATUSES } from "../../../data/admin/mockUsers";

const ROLE_OPTIONS = ["All Roles", ...USER_ROLES];
const STATUS_OPTIONS = ["All Status", ...USER_STATUSES];

export default function UserFilterBar({ query, onQueryChange, role, onRoleChange, status, onStatusChange, onAddUser }) {
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
          placeholder="Search name, email, role..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <select className={styles.select} value={role} onChange={(e) => onRoleChange(e.target.value)}>
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select className={styles.select} value={status} onChange={(e) => onStatusChange(e.target.value)}>
        {STATUS_OPTIONS.map((opt) => (
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

      {/* TODO: wire to a real add-user form once it exists */}
      <button type="button" className={styles.addBtn} onClick={onAddUser}>
        <span className={styles.addIcon}>+</span>
        Add User
      </button>
    </div>
  );
}