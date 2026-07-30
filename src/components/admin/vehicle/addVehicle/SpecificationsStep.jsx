import React from "react";
import { SEAT_OPTIONS, FUEL_TYPES } from "../../../../data/admin/mockVehicles";
import fields from "./FormFields.module.css";
import styles from "./SpecificationsStep.module.css";

export default function SpecificationsStep({ form, updateField }) {
  return (
    <div>
      <h2 className={fields.stepTitle}>Specifications</h2>

      <div className={fields.field}>
        <label className={fields.label}>
          Transmission <span className={fields.required}>*</span>
        </label>
        <div className={styles.toggleRow}>
          {["Automatic", "Manual"].map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles.toggleBtn} ${form.transmission === option ? styles.toggleBtnActive : ""}`}
              onClick={() => updateField("transmission", option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className={fields.row}>
        <div className={fields.field}>
          <label className={fields.label} htmlFor="seats">
            Seats <span className={fields.required}>*</span>
          </label>
          <select id="seats" className={fields.select} value={form.seats} onChange={(e) => updateField("seats", e.target.value)}>
            <option value="">Select seats</option>
            {SEAT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} seats
              </option>
            ))}
          </select>
        </div>

        <div className={fields.field}>
          <label className={fields.label} htmlFor="fuelType">
            Fuel Type <span className={fields.required}>*</span>
          </label>
          <select
            id="fuelType"
            className={fields.select}
            value={form.fuelType}
            onChange={(e) => updateField("fuelType", e.target.value)}
          >
            <option value="">Select fuel type</option>
            {FUEL_TYPES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}