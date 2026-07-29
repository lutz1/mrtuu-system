import React, { useEffect, useRef, useState } from "react";
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

export default function UserRowActions({ user, onToggleStatus }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, placement: "bottom" });
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

  const isActive = user.status === "Active";

  return (
    <>
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
              transform: menuPos.placement === "top" ? "translateY(-100%)" : "none",
            }}
          >
            <button type="button" className={styles.menuItem} onClick={() => setIsOpen(false)}>
              Edit User
            </button>
            <button type="button" className={styles.menuItem} onClick={() => setIsOpen(false)}>
              Reset Password
            </button>
            <button
              type="button"
              className={styles.menuItem}
              onClick={() => {
                onToggleStatus(user.id);
                setIsOpen(false);
              }}
            >
              {isActive ? "Deactivate User" : "Activate User"}
            </button>
            <button
              type="button"
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              onClick={() => setIsOpen(false)}
            >
              Delete User
            </button>
          </div>,
          document.body
        )}
    </>
  );
}