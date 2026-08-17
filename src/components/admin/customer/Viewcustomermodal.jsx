import { useEffect, useRef } from "react";
import styles from "./ViewCustomerModal.module.css";

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
function BookingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 4.5v3M16 4.5v3M4.5 10.5h15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * "View Customer" detail modal — opened from the eye icon in CustomerRowActions.
 *
 * Personal Information reads: name, customerId (or id), email, phone,
 * dateOfBirth, address, joinedDate, status.
 *
 * Booking Summary (totalBookings / completedBookings / ongoingBookings) isn't
 * part of CustomersContext yet — pass them in on the customer object once
 * you have a bookings source to join against; until then this renders "—".
 */
export default function ViewCustomerModal({ customer, open, onClose }) {
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

  if (!open || !customer) return null;

  const initials = (customer.name || customer.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  const isVerified = customer.status === "Verified";

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
        aria-label="View Customer"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>View Customer</h2>
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
            {customer.photoURL ? (
              <img src={customer.photoURL} alt="" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <h3 className={styles.name}>{customer.name || "—"}</h3>
            <p className={styles.customerId}>
              Customer ID: {customer.id || customer.customerId || "—"}
            </p>
            <span
              className={`${styles.statusBadge} ${
                isVerified ? styles.verified : styles.unverified
              }`}
            >
              <span className={styles.statusDot} />
              {customer.status || "—"}
            </span>
          </div>
        </div>

        <hr className={styles.divider} />

        <Section icon={<PersonIcon />} title="Personal Information">
          <div className={styles.grid}>
            <Detail label="Full Name" value={customer.name} strong />
            <Detail label="Email Address" value={customer.email} strong />
            <Detail label="Contact No." value={customer.phone} strong />
            <Detail
              label="Date of Birth"
              value={customer.dateOfBirth}
              strong
            />
            <Detail label="Address" value={customer.address} strong />
            <Detail
              label="Joined Date"
              value={customer.joinedDate}
              strong
            />
          </div>
        </Section>

        <hr className={styles.divider} />

        <Section icon={<BookingIcon />} title="Booking Summary">
          <div className={styles.gridThree}>
            <Detail
              label="Total Bookings"
              value={customer.totalBookings}
              strong
              big
            />
            <Detail
              label="Completed Bookings"
              value={customer.completedBookings}
              strong
              big
            />
            <Detail
              label="Ongoing Bookings"
              value={customer.ongoingBookings}
              strong
              big
            />
          </div>
        </Section>

        <div className={styles.actions}>
          <button type="button" className={styles.closeAction} onClick={onClose}>
            Close
          </button>
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

function Detail({ label, value, strong, big }) {
  return (
    <div className={styles.detail}>
      <span className={styles.detailLabel}>{label}</span>
      <span
        className={
          big
            ? styles.detailValueBig
            : strong
            ? styles.detailValueStrong
            : styles.detailValue
        }
      >
        {value ?? "—"}
      </span>
    </div>
  );
}