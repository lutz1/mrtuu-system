import React, { useState } from "react";
import { PREDEFINED_FEATURES } from "../../../../data/admin/mockVehicles";
import fields from "./FormFields.module.css";
import styles from "./FeaturesStep.module.css";

export default function FeaturesStep({ form, updateField }) {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const allFeatures = [...new Set([...PREDEFINED_FEATURES, ...form.features])];

  const toggleFeature = (feature) => {
    const isSelected = form.features.includes(feature);
    updateField(
      "features",
      isSelected ? form.features.filter((f) => f !== feature) : [...form.features, feature]
    );
  };

  const handleAddCustom = () => {
    const trimmed = customValue.trim();
    if (trimmed && !form.features.includes(trimmed)) {
      updateField("features", [...form.features, trimmed]);
    }
    setCustomValue("");
    setIsAddingCustom(false);
  };

  return (
    <div>
      <h2 className={fields.stepTitle}>Features</h2>

      <div className={styles.pillRow}>
        {allFeatures.map((feature) => (
          <button
            key={feature}
            type="button"
            className={`${styles.pill} ${form.features.includes(feature) ? styles.pillActive : ""}`}
            onClick={() => toggleFeature(feature)}
          >
            {feature}
          </button>
        ))}

        {isAddingCustom ? (
          <input
            type="text"
            className={styles.customInput}
            autoFocus
            placeholder="Feature name"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onBlur={handleAddCustom}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustom();
              }
              if (e.key === "Escape") {
                setCustomValue("");
                setIsAddingCustom(false);
              }
            }}
          />
        ) : (
          <button type="button" className={styles.addPill} onClick={() => setIsAddingCustom(true)}>
            + Add
          </button>
        )}
      </div>

      <div className={fields.field}>
        <label className={fields.label} htmlFor="description">
          About this vehicle
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          placeholder="Describe the vehicle, its condition, history, or standout details"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>
    </div>
  );
}