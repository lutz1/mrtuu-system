import React from "react";
import fields from "./FormFields.module.css";

export default function PricingStep({ form, updateField }) {
  return (
    <div>
      <h2 className={fields.stepTitle}>Pricing</h2>

      <div className={fields.row}>
        <div className={fields.field}>
          <label className={fields.label} htmlFor="dailyRate">
            Daily rate <span className={fields.required}>*</span>
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

        <div className={fields.field}>
          <label className={fields.label} htmlFor="rate12h">
            12-hour rate
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
    </div>
  );
}