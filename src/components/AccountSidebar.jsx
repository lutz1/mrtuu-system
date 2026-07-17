import React from "react";
import NavIcon from "./icons/NavIcon";
import { NAV_ITEMS } from "../Data/navItems";
import styles from "./AccountSidebar.module.css";

export default function AccountSidebar({ activeSection, onSectionChange, onDeleteAccount }) {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarNav}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.sidebarItem} ${activeSection === item.id ? styles.sidebarItemActive : ""}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className={styles.sidebarIcon}>
              <NavIcon name={item.icon} />
            </span>
            {item.label}
          </button>
        ))}

        <div className={styles.sidebarDivider} />

        <button type="button" className={styles.sidebarItemDanger} onClick={onDeleteAccount}>
          <span className={styles.sidebarIcon}>
            <NavIcon name="trash" />
          </span>
          Delete Account
        </button>
      </nav>
    </aside>
  );
}