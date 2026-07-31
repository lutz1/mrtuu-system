import React from "react";
import fields from "./FormFields.module.css";

export default function PricingStep({ form, updateField }) {
  return (
    <div>
      <h2 className={fields.stepTitle}>Pricing</h2>

      {/* Applied both classes here */}
      <div className={`${fields.row} ${fields.threeColumns}`}>
        {/* Daily Rate */}
        <div className={fields.field}>
          <label className={fields.label} htmlFor="dailyRate">
            Daily Rate <span className={fields.required}>*</span>
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
            12-hour rate <span className={fields.required}>*</span>
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

        {/* Overcharge (per hour) */}
        <div className={fields.field}>
          <label className={fields.label} htmlFor="overchargePerHour">
            Overcharge (per hour)<span className={fields.required}>*</span>
          </label>
          <div className={fields.inputWrapper}>
            <input
              id="overchargePerHour"
              type="number"
              min="0"
              step="10"
              className={fields.input}
              placeholder="₱ 0.00"
              value={form.overchargePerHour}
              onChange={(e) => updateField("overchargePerHour", e.target.value)}
            />
            <span className={fields.inputSuffix}>per hour</span>
          </div>
        </div>
      </div>
    </div>
  );
}