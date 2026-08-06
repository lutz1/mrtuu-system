import React from "react";
import stepCard from "./StepCard.module.css";
import styles from "./ReviewSubmitStep.module.css";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 6L9 17L4 12"
        stroke="#16a34a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhotoPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" />
      <path d="M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      <path d="M21 15l-5-5-11 11" />
    </svg>
  );
}

const PHOTO_LABELS = { front: "Front View", back: "Back View", left: "Left Side View", right: "Right Side View" };
const DOCUMENT_LABELS = {
  orcr: "OR/CR",
  insurance: "Insurance",
  officialReceipt: "Official Receipt",
  vehicleRegistration: "Vehicle Registration",
};
const CONDITION_LABELS = { exterior: "Exterior", interior: "Interior", tires: "Tires", lights: "Lights" };

export default function ReviewSubmitStep({ photos = {}, odometer, fuelLevel, documents = {}, condition = {}, remarks, onRemarksChange }) {
  const uploadedCount = Object.values(photos).filter(Boolean).length;

  return (
    <div className={styles.list}>
      {/* 1. Vehicle Photos */}
      <section className={`${stepCard.card} ${styles.card}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>1. Vehicle Photos</h2>
          <span className={styles.statusBadge}>{uploadedCount}/4 Uploaded</span>
        </div>

        <div className={styles.photoGrid}>
          {Object.keys(PHOTO_LABELS).map((key) => (
            <div key={key} className={styles.photoBox}>
              {photos[key] ? (
                <img src={photos[key].previewUrl || photos[key]} alt={PHOTO_LABELS[key]} className={styles.photoImage} />
              ) : (
                <PhotoPlaceholder />
              )}
            </div>
          ))}
        </div>

        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Odometer Reading</span>
          <span className={styles.summaryValue}>{odometer ? `${Number(odometer).toLocaleString()} km` : "—"}</span>
        </div>
      </section>

      {/* 2. Fuel & Documents */}
      <section className={`${stepCard.card} ${styles.card}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>2. Fuel &amp; Documents</h2>
          <span className={styles.statusBadge}>
            <span className={styles.badgeCheck}>✓</span> Completed
          </span>
        </div>

        <div className={styles.summaryRowNoBorder}>
          <span className={styles.summaryLabel}>Fuel Level</span>
          <span className={styles.summaryValue}>{fuelLevel || "—"}</span>
        </div>

        {Object.keys(DOCUMENT_LABELS).map((key) => (
          <div key={key} className={styles.checkRow}>
            <span className={styles.summaryLabel}>{DOCUMENT_LABELS[key]}</span>
            <span className={styles.checkValue}>
              {documents[key] === "Present" && (
                <span className={styles.checkIcon}>
                  <CheckIcon />
                </span>
              )}
              {documents[key] || "—"}
            </span>
          </div>
        ))}
      </section>

      {/* 3. Vehicle Condition */}
      <section className={`${stepCard.card} ${styles.card}`}>
        <h2 className={styles.sectionTitle}>3. Vehicle Condition</h2>

        {Object.keys(CONDITION_LABELS).map((key) => (
          <div key={key} className={styles.checkRow}>
            <span className={styles.summaryLabel}>{CONDITION_LABELS[key]}</span>
            <span className={styles.checkValue}>
              {condition[key] && (
                <span className={styles.checkIcon}>
                  <CheckIcon />
                </span>
              )}
              {condition[key] || "—"}
            </span>
          </div>
        ))}
      </section>

      {/* 4. General Remarks */}
      <section className={`${stepCard.card} ${styles.card}`}>
        <h2 className={styles.sectionTitle}>General Remarks</h2>
        <textarea
          className={styles.remarksInput}
          placeholder="Vehicle is in good condition."
          value={remarks}
          onChange={(e) => onRemarksChange?.(e.target.value)}
        />
      </section>
    </div>
  );
}