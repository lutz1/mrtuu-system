import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useStaff } from "../../../context/StaffContext";
import styles from "./AdminSidebar.module.css";

const ALL_NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  {
    to: "/admin/bookings",
    label: "Bookings",
    icon: "bookings",
    permission: "view_reports",
  },
  {
    to: "/admin/vehicles",
    label: "Vehicles",
    icon: "vehicles",
    permission: "manage_fleet",
  },
  {
    to: "/admin/customers",
    label: "Customers",
    icon: "customers",
    permission: "view_reports",
  },
  {
    to: "/admin/sales-reports",
    label: "Sales & Reports",
    icon: "reports",
    permission: "view_reports",
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: "users",
    permission: "manage_staff",
  },
  {
    to: "/admin/profile",
    label: "Profile",
    icon: "profile",
  },
];

function NavIcon({ name }) {
  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );

    case "bookings":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4.5" y="3.5" width="15" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 8.5h8M8 12.5h8M8 16.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );

    case "checklist":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 6h9M8.5 12h9M8.5 18h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path
            d="M4.5 5.5l1 1 1.5-1.7M4.5 11.5l1 1 1.5-1.7M4.5 17.5l1 1 1.5-1.7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "vehicles":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 15l1.5-5A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 15"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="3" y="15" width="18" height="4.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="7.5" cy="19.5" r="1.4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16.5" cy="19.5" r="1.4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );

    case "customers":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3.5 19c1-3.4 3.2-5 5.5-5s4.5 1.6 5.5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="17" cy="8.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15.5 19c.5-2.3 1.8-3.5 3-3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "reports":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 20V10M10.5 20V4M17 20v-7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      );

    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8.5" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
          <path d="M2.5 19c1-3.4 3.2-5 6-5s5 1.6 6 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path
            d="M15 6a3 3 0 0 1 0 6M17 19c-.4-2-1.4-3.6-2.8-4.6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "profile":
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 19c1.2-3.8 3.8-5.8 7-5.8s5.8 2 7 5.8"
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

function ChevronIcon({ collapsed }) {
  // Shows ">>" when folded (click to expand), "<<" when expanded (click to fold)
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {collapsed ? (
        <path
          d="M8 5l7 7-7 7M13 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M16 5l-7 7 7 7M11 5l-7 7 7 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function AdminSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { hasPermission } = useStaff();

  const navItems = ALL_NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""} ${
        isCollapsed ? styles.sidebarCollapsed : ""
      }`}
    >
      {/* Mobile close button */}
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close menu"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className={styles.sidebarHeader}>
        {!isCollapsed && <p className={styles.menuLabel}>Menu</p>}

        <button
          type="button"
          className={styles.collapseBtn}
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
          title={isCollapsed ? "Expand menu" : "Collapse menu"}
        >
          <ChevronIcon collapsed={isCollapsed} />
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <span className={styles.navIcon}>
              <NavIcon name={item.icon} />
            </span>

            {!isCollapsed && item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className={styles.logoutBtn}
        onClick={handleLogout}
        title={isCollapsed ? "Logout" : undefined}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path
            d="M14 8l4 4-4 4M18 12H9"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {!isCollapsed && "Logout"}
      </button>
    </aside>
  );
}