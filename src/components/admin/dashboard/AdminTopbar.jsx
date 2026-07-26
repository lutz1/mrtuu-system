import React from "react";
import logo from "../../../assets/logo.png";
import styles from "./AdminTopbar.module.css";

// TODO: "Selsite" / "Admin" and the avatar initial are placeholders —
// replace once AdminAuthContext carries a real identity/role.
export default function AdminTopbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <img src={logo} alt="Lyka's Car Rental" className={styles.logo} />
        <span className={styles.brandName}>Lyka's Car Rental</span>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.bellBtn} aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 10a6 6 0 1 1 12 0c0 3.5 1 5 1.5 5.5H4.5C5 15 6 13.5 6 10z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path d="M9.5 18.5a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>

        {/* TODO: wire to a real profile menu once one exists */}
        <button type="button" className={styles.userChip}>
          <span className={styles.userAvatar}>S</span>
          <span className={styles.userText}>
            <span className={styles.userName}>Selsite</span>
            <span className={styles.userRole}>Admin</span>
          </span>
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}