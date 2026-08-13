import React from "react";
import RadioOptionGroup from "./RadioOptionGroup";
import stepCard from "./StepCard.module.css";
import styles from "./VehicleConditionStep.module.css";

const FIELDS = [
  {
    key: "exterior",
    label: "Exterior",
    options: ["Good", "With Scratch", "With Dent", "Needs Repair"],
  },
  {
    key: "interior",
    label: "Interior",
    options: ["Clean", "Needs Cleaning", "With Damage"],
  },
  {
    key: "tires",
    label: "Tires",
    options: ["Good", "Low Pressure", "Needs Replacement"],
  },
  {
    key: "lights",
    label: "Lights",
    options: ["Working", "Not Working"],
  },
];

export default function VehicleConditionStep({
  mode = "pickup",
  preRentData = null,
  condition,
  onConditionChange,
}) {
  const isReturnMode = mode === "return";
  const pickupCondition = preRentData?.condition || {};

  return (
    <div className={stepCard.card}>
      <h2 className={stepCard.title}>
        {isReturnMode ? "Return Condition Assessment" : "Vehicle Condition"}
      </h2>

      <div className={styles.list}>
        {FIELDS.map((field) => {
          const baselineValue = pickupCondition[field.key];

          return (
            <div key={field.key} className={styles.row}>
              <div className={styles.labelHeader}>
                <h3 className={styles.rowLabel}>{field.label}</h3>

                {/* Pickup Baseline Badge in Return Mode */}
                {isReturnMode && baselineValue && (
                  <span className={styles.baselineBadge}>
                    Pickup Condition: <strong>{baselineValue}</strong>
                  </span>
                )}
              </div>

              <RadioOptionGroup
                name={field.key}
                options={field.options}
                value={condition[field.key]}
                onChange={(value) => onConditionChange(field.key, value)}
                layout="horizontal"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}