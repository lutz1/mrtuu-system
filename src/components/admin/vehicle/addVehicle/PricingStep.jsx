import React from "react";
import fields from "./FormFields.module.css";

export default function PricingStep({ form, updateField }) {
  return (
    <div>
      <h2 className={fields.stepTitle}>Rental Rates</h2>

      {/* Base Rental Rates */}
      <div className={`${fields.row} ${fields.twoColumns}`}>
        {/* Daily Rate */}
        <div className={fields.field}>
          <label className={fields.label} htmlFor="dailyRate">
            Daily Rate (24h) <span className={fields.required}>*</span>
          </label>
          <input
            id="dailyRate"
            type="number"
            min="0"
            step="50"
            className={fields.input}
            placeholder="₱ 0.00"
            value={form.dailyRate}
            onChange={(e) => updateField("dailyRate", e.target.value)}
          />
        </div>

        {/* 12-hour Rate */}
        <div className={fields.field}>
          <label className={fields.label} htmlFor="rate12h">
            12-Hour Rate <span className={fields.required}>*</span>
          </label>
          <input
            id="rate12h"
            type="number"
            min="0"
            step="50"
            className={fields.input}
            placeholder="₱ 0.00"
            value={form.rate12h}
            onChange={(e) => updateField("rate12h", e.target.value)}
          />
        </div>
      </div>

      <h2 className={fields.stepTitle} style={{ marginTop: "24px" }}>
        Overcharge Fees
      </h2>

      {/* Overcharge Fees */}
      <div className={`${fields.row} ${fields.twoColumns}`}>
        {/* Late Return Fee */}
        <div className={fields.field}>
          <label className={fields.label} htmlFor="lateFeePerHour">
            Late Return Fee (per hour)
          </label>
          <div className={fields.inputWrapper}>
            <input
              id="lateFeePerHour"
              type="number"
              min="0"
              step="10"
              className={fields.input}
              placeholder="₱ 0.00"
              value={form.lateFeePerHour || form.overchargePerHour || ""}
              onChange={(e) => updateField("lateFeePerHour", e.target.value)}
            />
            <span className={fields.inputSuffix}>/ hr</span>
          </div>
        </div>

        {/* Excess Mileage Fee */}
        <div className={fields.field}>
          <label className={fields.label} htmlFor="excessMileageFeePerKm">
            Excess Mileage Fee (per km)
          </label>
          <div className={fields.inputWrapper}>
            <input
              id="excessMileageFeePerKm"
              type="number"
              min="0"
              step="1"
              className={fields.input}
              placeholder="₱ 0.00"
              value={form.excessMileageFeePerKm || ""}
              onChange={(e) => updateField("excessMileageFeePerKm", e.target.value)}
            />
            <span className={fields.inputSuffix}>/ km</span>
          </div>
        </div>
      </div>
    </div>
  );
}