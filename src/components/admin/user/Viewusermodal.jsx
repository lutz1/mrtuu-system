import { useEffect, useRef, useState } from "react";
import styles from "./ViewUserModal.module.css";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 19c1.2-4 3.8-5.8 7-5.8s5.8 1.8 7 5.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 10.5V8a6 6 0 0 1 12 0v2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="4.5"
        y="10.5"
        width="15"
        height="9.5"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 12h4l2 6 4-14 2 8h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12.2A2 2 0 0 0 9 21h6a2 2 0 0 0 2-1.8L18 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(value) {
  if (!value) return "—";
  // Accepts a Date, Firestore Timestamp (has .toDate()), or an ISO/parsable string.
  const date =
    typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * "View User" detail modal — opened from the eye icon in UserRowActions.
 *
 * Pass the selected staff record as `user`. Field names are read defensively
 * (a couple of fallbacks per field) since the exact StaffContext shape wasn't
 * available here — adjust the small set of `user.xxx` reads below to match
 * your real staff document if names differ.
 */
export default function ViewUserModal({
  user,
  open,
  onClose,
  onDelete,
  canDelete = true,
}) {
  const [deleting, setDeleting] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !user) return null;

  const initials = (user.displayName || user.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${user.displayName || user.email}? This can't be undone.`)) {
      return;
    }
    setDeleting(true);
    try {
      await onDelete?.(user);
      onClose?.();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="View User"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>View User</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.identity}>
          <div className={styles.avatar}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <h3 className={styles.name}>{user.displayName || "—"}</h3>
            <span className={styles.roleBadge}>{user.role || "—"}</span>
          </div>
        </div>

        <hr className={styles.divider} />

        <Section icon={<PersonIcon />} title="Personal Information">
          <div className={styles.grid}>
            <Detail label="Full Name" value={user.displayName} />
            <Detail label="Email Address" value={user.email} />
            <Detail label="User ID" value={user.uid || user.userId} />
            <Detail label="Phone Number" value={user.phone || user.phoneNumber} />
            <Detail label="Role" value={user.roleLabel || user.role} strong />
          </div>
        </Section>

        <hr className={styles.divider} />

        <Section icon={<LockIcon />} title="Login Information">
          <div className={styles.grid}>
            <Detail label="Username" value={user.username} />
            <Detail label="Last Login" value={formatDate(user.lastLogin)} strong />
          </div>
        </Section>

        <hr className={styles.divider} />

        <Section icon={<ActivityIcon />} title="Activity Information">
          <div className={styles.grid}>
            <Detail label="Date Created" value={formatDate(user.createdAt)} strong />
            <Detail label="Created By" value={user.createdBy} strong />
            <Detail label="Last Updated" value={formatDate(user.updatedAt)} strong />
          </div>
        </Section>

        <div className={styles.actions}>
          <button type="button" className={styles.closeAction} onClick={onClose}>
            Close
          </button>
          {canDelete && (
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDelete}
              disabled={deleting}
            >
              <TrashIcon />
              {deleting ? "Deleting…" : "Delete User"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>{icon}</span>
        <h4 className={styles.sectionTitle}>{title}</h4>
      </div>
      {children}
    </section>
  );
}

function Detail({ label, value, strong }) {
  return (
    <div className={styles.detail}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={strong ? styles.detailValueStrong : styles.detailValue}>
        {value || "—"}
      </span>
    </div>
  );
}