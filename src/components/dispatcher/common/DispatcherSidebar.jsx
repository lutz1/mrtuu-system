import { NavLink, useNavigate } from "react-router-dom";
import styles from "./DispatcherSidebar.module.css";
import { useAuth } from "../../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dispatcher/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/dispatcher/inspection", label: "Inspection", icon: "inspection" },
  { to: "/dispatcher/history", label: "History", icon: "history" },
];

function NavIcon({ name }) {
  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="3.5"
            y="3.5"
            width="7"
            height="7"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <rect
            x="13.5"
            y="3.5"
            width="7"
            height="7"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <rect
            x="3.5"
            y="13.5"
            width="7"
            height="7"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <rect
            x="13.5"
            y="13.5"
            width="7"
            height="7"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />
        </svg>
      );
    case "inspection":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 15l1.5-5A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 15"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="3"
            y="15"
            width="18"
            height="4.5"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <circle
            cx="7.5"
            cy="19.5"
            r="1.4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="16.5"
            cy="19.5"
            r="1.4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "history":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 12a8 8 0 1 1 2.3 5.6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 17v-5h5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8v4l3 2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "profile":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="12"
            cy="8"
            r="3.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function DispatcherSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className={styles.sidebar}>
      <p className={styles.menuLabel}>Menu</p>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <span className={styles.navIcon}>
              <NavIcon name={item.icon} />
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.divider} />

      <NavLink
        to="/dispatcher/profile"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
        }
      >
        <span className={styles.navIcon}>
          <NavIcon name="profile" />
        </span>
        Profile
      </NavLink>

      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M14 8l4 4-4 4M18 12H9"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Logout
      </button>
    </aside>
  );
}
