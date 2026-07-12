import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./AccountPage.module.css";

export default function AccountPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Placeholder until real user data (name, email, etc.) is stored in
  // AuthContext — e.g. once Firebase login is wired up.
  const userName = "Selsite";
  const initial = userName.trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar}>{initial}</div>
        <h1 className={styles.name}>{userName}</h1>

        <div className={styles.infoList}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Account</span>
            <span className={styles.infoValue}>{userName}</span>
          </div>
        </div>

        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}