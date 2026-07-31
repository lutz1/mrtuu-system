import React, { useState } from "react";
import fields from "./FormFields.module.css";
import styles from "./ReviewStep.module.css";

export default function ReviewStep({ form, photoCount }) {
  // TODO: the reference design's "Confirm details" button has no clear
  // functional spec — treated here as a simple reviewed/acknowledged
  // toggle that doesn't gate saving. Revisit once its intended behavior
  // is clarified.
  const [isConfirmed, setIsConfirmed] = useState(false);

  const rows = [
    { label: "Car name", value: form.carName || "—" },
    { label: "License plate", value: form.plate || "—" },
    { label: "Brand / model", value: `${form.brand || "—"} ${form.model || ""}`.trim() },
    { label: "Transmission", value: form.transmission },
    { label: "Seats/ fuel", value: `${form.seats || "—"} seats • ${form.fuelType || "—"}` },
    { label: "Daily rate", value: form.dailyRate ? `₱ ${Number(form.dailyRate).toFixed(2)}` : "—" },
    { label: "Photos uploaded", value: `${photoCount} / 5` },
    { label: "Features selected", value: form.features.length },
  ];

  return (
    <div>
      <div className={styles.headerRow}>
        <h2 className={fields.stepTitle}>Review</h2>
        <button
          type="button"
          className={`${styles.confirmBtn} ${isConfirmed ? styles.confirmBtnActive : ""}`}
          onClick={() => setIsConfirmed((prev) => !prev)}
        >
          {isConfirmed ? "Details confirmed" : "Confirm details"}
        </button>
      </div>

      <div className={styles.table}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <span className={styles.rowLabel}>{row.label}</span>
            <span className={styles.rowValue}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}