import React, { useEffect, useRef, useState } from "react";
import styles from "./CustomerRowActions.module.css";

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="5" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="19" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function CustomerRowActions({ customer, onToggleVerification }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setIsOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isVerified = customer.status === "Verified";

  return (
    <div className={styles.wrap} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Actions for ${customer.name}`}
      >
        <DotsIcon />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {/* TODO: link to a real customer-profile view once it exists */}
          <button type="button" className={styles.menuItem} onClick={() => setIsOpen(false)}>
            View Profile
          </button>
          <button
            type="button"
            className={styles.menuItem}
            onClick={() => {
              onToggleVerification(customer.id);
              setIsOpen(false);
            }}
          >
            {isVerified ? "Mark as Unverified" : "Mark as Verified"}
          </button>
          {/* TODO: wire to a real deactivate/suspend flow once it exists */}
          <button type="button" className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={() => setIsOpen(false)}>
            Deactivate Customer
          </button>
        </div>
      )}
    </div>
  );
}