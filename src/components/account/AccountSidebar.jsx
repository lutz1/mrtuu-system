import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavIcon from "../icons/NavIcon";
import { NAV_ITEMS } from "../../Data/navItems";
import styles from "./AccountSidebar.module.css";

// Maps each nav item id to its actual route. Update this alongside App.jsx
// whenever a new Account sub-page gets its own route.
const ROUTE_MAP = {
  personal: "/account",
  bookings: "/account/bookings",
  payment: "/account/payment",
  notifications: "/account/notifications",
  settings: "/account/settings",
  security: "/account/security",
};

export default function AccountSidebar({ onDeleteAccount }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarNav}>
        {NAV_ITEMS.map((item) => {
          const path = ROUTE_MAP[item.id];
          const isActive = location.pathname === path;

          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ""}`}
              onClick={() => path && navigate(path)}
            >
              <span className={styles.sidebarIcon}>
                <NavIcon name={item.icon} />
              </span>
              {item.label}
            </button>
          );
        })}

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