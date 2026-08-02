import React, { useState } from "react";
import fields from "./FormFields.module.css";
import styles from "./ReviewStep.module.css";

export default function ReviewStep({ form, photoCount }) {
  // Toggle state to acknowledge details have been checked
  const [isConfirmed, setIsConfirmed] = useState(false);

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "—";
    const num = Number(amount);
    return Number.isNaN(num) ? "—" : `₱ ${num.toFixed(2)}`;
  };

  const rows = [
    { label: "Car name", value: form.carName || "—" },
    { label: "License plate", value: form.plate || "—" },
    { label: "Brand / model", value: `${form.brand || "—"} ${form.model || ""}`.trim() },
    { label: "Year / Color", value: `${form.yearModel || "—"} • ${form.color || "—"}` },
    { label: "Transmission", value: form.transmission },
    { label: "Seats / fuel", value: `${form.seats || "—"} seats • ${form.fuelType || "—"}` },
    { label: "Daily rate (24h)", value: formatCurrency(form.dailyRate) },
    { label: "12-Hour rate", value: form.rate12h ? formatCurrency(form.rate12h) : "—" },
    { label: "Late return fee", value: form.lateFeePerHour ? `${formatCurrency(form.lateFeePerHour)} / hr` : "—" },
    { label: "Excess mileage fee", value: form.excessMileageFeePerKm ? `${formatCurrency(form.excessMileageFeePerKm)} / km` : "—" },
    { label: "Photos uploaded", value: `${photoCount} / 5` },
    { label: "Features selected", value: form.features?.length || 0 },
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