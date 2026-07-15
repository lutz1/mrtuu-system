import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./AccountPage.module.css";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userName =
    user?.displayName || (user?.email ? user.email.split("@")[0] : "Account");
  const initial = userName.trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {user?.photoURL ? (
          <img src={user.photoURL} alt={userName} className={styles.avatarImage} />
        ) : (
          <div className={styles.avatar}>{initial}</div>
        )}

        <h1 className={styles.name}>{userName}</h1>

        <div className={styles.infoList}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Name</span>
            <span className={styles.infoValue}>{userName}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{user?.email || "—"}</span>
          </div>
        </div>

        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}