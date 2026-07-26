import React, { useState } from "react";
import styles from "./DangerZoneCard.module.css";

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3.5l9.5 16.5H2.5L12 3.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function DangerZoneCard({ onDeleteAccount }) {
  const [confirming, setConfirming] = useState(false);

  const handleDeleteClick = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onDeleteAccount?.();
    setConfirming(false);
  };

  return (
    <section className={styles.card}>
      <div className={styles.content}>
        <span className={styles.icon}>
          <WarningIcon />
        </span>
        <div className={styles.text}>
          <h3 className={styles.title}>Danger Zone</h3>
          <p className={styles.description}>
            Permanently delete your Lyka account and all associated rental history. This action is
            irreversible.
          </p>
        </div>
      </div>

      <button type="button" className={styles.deleteBtn} onClick={handleDeleteClick}>
        {confirming ? "Click again to confirm" : "Delete My Account"}
      </button>
    </section>
  );
}