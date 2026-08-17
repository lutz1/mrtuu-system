import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./UserRowActions.module.css";

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

export default function UserRowActions({
  user,
  isSelf,
  canDelete,
  onView,
  onToggleStatus,
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({
    top: 0,
    left: 0,
    placement: "bottom",
  });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const openMenu = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 180;
    const menuEstimatedHeight = 160;

    // Check if menu overflows bottom of viewport
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuEstimatedHeight;

    let left = rect.right - menuWidth;
    if (left < 10) left = 10;

    setMenuPos({
      top: openUpward ? rect.top - 6 : rect.bottom + 6,
      left: left,
      placement: openUpward ? "top" : "bottom",
    });
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const handleScroll = () => setIsOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const isActive = user.active;

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => onView?.(user)}
        aria-label={`View ${user.name}`}
        title="View"
      >
        <EyeIcon />
      </button>

      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        aria-label={`Actions for ${user.name}`}
      >
        <DotsIcon />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.menu}
            style={{
              top: menuPos.top,
              left: menuPos.left,
              transform:
                menuPos.placement === "top" ? "translateY(-100%)" : "none",
            }}
          >
            {!isSelf && (
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => {
                  onToggleStatus(user);
                  setIsOpen(false);
                }}
              >
                {isActive ? "Deactivate User" : "Activate User"}
              </button>
            )}
            {isSelf && (
              <p className={styles.selfNote}>
                You can't edit or deactivate your own account.
              </p>
            )}
            {canDelete && !isSelf && (
              <button
                type="button"
                className={`${styles.menuItem} ${styles.menuItemDanger}`}
                onClick={() => {
                  onDelete(user);
                  setIsOpen(false);
                }}
              >
                Delete User
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}