import { useEffect, useRef, useState } from "react";
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

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 12S5.8 5.5 12 5.5 21.5 12 21.5 12 18.2 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function CustomerRowActions({
  customer,
  onView,
  onToggleVerification,
}) {
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
    <div className={styles.actions} ref={rootRef}>
      <button
        type="button"
        className={styles.viewButton}
        onClick={() => onView?.(customer)}
        aria-label={`View ${customer.name}`}
        title="View"
      >
        <EyeIcon />
      </button>

      <div className={styles.wrap}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={`More actions for ${customer.name}`}
        >
          <DotsIcon />
        </button>

        {isOpen && (
          <div className={styles.menu}>
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
            <button
              type="button"
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              onClick={() => setIsOpen(false)}
            >
              Deactivate Customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}