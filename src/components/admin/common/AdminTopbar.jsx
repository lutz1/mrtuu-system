import { useAuth } from "../../../context/AuthContext";
import { useStaff } from "../../../context/StaffContext";
import logo from "../../../assets/logo.png";
import styles from "./AdminTopbar.module.css";

const ROLE_LABELS = {
  owner: "Owner",
  staff: "Staff",
  checklist_admin: "Checklist Admin",
  dispatcher: "Dispatcher",
};

export default function AdminTopbar() {
  const { user } = useAuth();
  const { staffProfile } = useStaff();

  const displayName = user?.displayName || staffProfile?.displayName || "Admin";
  const roleLabel =
    ROLE_LABELS[staffProfile?.role] || staffProfile?.role || "Admin";
  const initial = displayName.trim().charAt(0).toUpperCase() || "A";

  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <img src={logo} alt="Lyka's Car Rental" className={styles.logo} />
        <span className={styles.brandName}>Lyka's Car Rental</span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.bellBtn}
          aria-label="Notifications"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 10a6 6 0 1 1 12 0c0 3.5 1 5 1.5 5.5H4.5C5 15 6 13.5 6 10z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 18.5a2.5 2.5 0 0 0 5 0"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <button type="button" className={styles.userChip}>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className={styles.userAvatar}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span className={styles.userAvatar}>{initial}</span>
          )}
          <span className={styles.userText}>
            <span className={styles.userName}>{displayName}</span>
            <span className={styles.userRole}>{roleLabel}</span>
          </span>
          <svg
            className={styles.chevron}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
