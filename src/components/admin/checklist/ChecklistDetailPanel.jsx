import React, { useState, useEffect } from "react";
import BookingStatusBadge from "../booking/BookingStatusBadge";
import styles from "./ChecklistDetailPanel.module.css";

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3.5" width="16" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M13.5 9h4M13.5 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function ChecklistDetailPanel({ entry, onClose, onReject, onSendToDispatcher }) {
  const [remarks, setRemarks] = useState(entry?.remarks ?? "");

  // Reset the remarks draft whenever a different booking is selected —
  // otherwise switching rows would carry over the previous entry's
  // unsaved remarks text.
  useEffect(() => {
    setRemarks(entry?.remarks ?? "");
  }, [entry?.id]);

  if (!entry) return null;

  return (
    <aside className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Booking ID {entry.id}</h2>
        <div className={styles.headerActions}>
          <BookingStatusBadge status={entry.checklistStatus} />
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close details">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.customerRow}>
        <span className={styles.avatar}>{getInitials(entry.customer)}</span>
        <div className={styles.customerInfo}>
          <p className={styles.customerName}>{entry.customer}</p>
          <p className={styles.customerMeta}>{entry.phone}</p>
          <p className={styles.customerMeta}>{entry.email}</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.vehicleInfo}>
          <p className={styles.vehicleName}>{entry.vehicle}</p>
          <p className={styles.vehicleMeta}>{entry.plate}</p>
          <p className={styles.vehicleMeta}>
            {entry.transmission} • {entry.seats} Seats
          </p>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div>
          <p className={styles.summaryLabel}>Rental Date</p>
          <p className={styles.summaryValue}>{entry.rentalDate}</p>
          <p className={styles.summarySub}>{entry.rentalTime}</p>
        </div>
        <div>
          <p className={styles.summaryLabel}>Return Date</p>
          <p className={styles.summaryValue}>{entry.returnDate}</p>
          <p className={styles.summarySub}>{entry.returnTime}</p>
        </div>
        <div>
          <p className={styles.summaryLabel}>Total Amount</p>
          <p className={styles.summaryValue}>₱{entry.amount.toLocaleString()}.00</p>
        </div>
        <div>
          <p className={styles.summaryLabel}>Payment Method</p>
          <p className={styles.summaryValue}>{entry.paymentMethod}</p>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Required Documents</h3>
      <div className={styles.documentsList}>
        {entry.documents.map((doc) => (
          <div key={doc.key} className={styles.documentRow}>
            <span className={styles.documentIcon}>
              <DocumentIcon />
            </span>
            <div className={styles.documentInfo}>
              <p className={styles.documentLabel}>{doc.label}</p>
              <p className={styles.documentDescription}>{doc.description}</p>
            </div>
            <span
              className={`${styles.documentStatus} ${
                doc.status === "Uploaded" ? styles.documentStatusUploaded : styles.documentStatusMissing
              }`}
            >
              <span className={styles.documentDot} />
              {doc.status}
            </span>
            {/* TODO: wire to a real document preview once file storage exists */}
            <button type="button" className={styles.viewDocBtn} disabled={doc.status !== "Uploaded"}>
              View
            </button>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>Remarks (Optional)</h3>
      <textarea
        className={styles.remarksInput}
        placeholder="Add remarks here..."
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />

      <div className={styles.actionsRow}>
        <button type="button" className={styles.rejectBtn} onClick={() => onReject(entry.id, remarks)}>
          Reject Booking
        </button>
        <button type="button" className={styles.dispatchBtn} onClick={() => onSendToDispatcher(entry.id, remarks)}>
          Send to Dispatcher
        </button>
      </div>
    </aside>
  );
}