import { SEAT_OPTIONS, FUEL_TYPES, DRIVETRAIN_OPTIONS, DOOR_OPTIONS } from "../../../../data/admin/mockVehicles";
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

      <div className={fields.row}>
        <div className={fields.field}>
          <label className={fields.label} htmlFor="variant">
            Variant
          </label>
          <input
            id="variant"
            type="text"
            className={fields.input}
            placeholder="e.g. 1.5E CVT"
            value={form.variant}
            onChange={(e) => updateField("variant", e.target.value)}
          />
        </div>

        <div className={fields.field}>
          <label className={fields.label} htmlFor="engine">
            Engine
          </label>
          <input
            id="engine"
            type="text"
            className={fields.input}
            placeholder="e.g. 1.5L Dual VVT-i"
            value={form.engine}
            onChange={(e) => updateField("engine", e.target.value)}
          />
        </div>
      </div>

      <div className={fields.row}>
        <div className={fields.field}>
          <label className={fields.label} htmlFor="fuelCapacity">
            Fuel Capacity (Liters)
          </label>
          <input
            id="fuelCapacity"
            type="number"
            min="0"
            className={fields.input}
            placeholder="e.g. 42"
            value={form.fuelCapacity}
            onChange={(e) => updateField("fuelCapacity", e.target.value)}
          />
        </div>

        <div className={fields.field}>
          <label className={fields.label} htmlFor="mileage">
            Mileage (km/l)
          </label>
          <input
            id="mileage"
            type="number"
            min="0"
            className={fields.input}
            placeholder="e.g. 16"
            value={form.mileage}
            onChange={(e) => updateField("mileage", e.target.value)}
          />
        </div>
      </div>

      <div className={fields.row}>
        <div className={fields.field}>
          <label className={fields.label} htmlFor="doors">
            Doors
          </label>
          <select id="doors" className={fields.select} value={form.doors} onChange={(e) => updateField("doors", e.target.value)}>
            <option value="">Select doors</option>
            {DOOR_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} Doors
              </option>
            ))}
          </select>
        </div>

        <div className={fields.field}>
          <label className={fields.label} htmlFor="drivetrain">
            Drivetrain
          </label>
          <select
            id="drivetrain"
            className={fields.select}
            value={form.drivetrain}
            onChange={(e) => updateField("drivetrain", e.target.value)}
          >
            <option value="">Select drivetrain</option>
            {DRIVETRAIN_OPTIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}