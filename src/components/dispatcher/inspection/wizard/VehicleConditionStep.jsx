import React from "react";
import RadioOptionGroup from "./RadioOptionGroup";
import stepCard from "./StepCard.module.css";
import styles from "./VehicleConditionStep.module.css";

const FIELDS = [
  { key: "exterior", label: "Exterior", options: ["Good", "With Scratch", "With Dent", "Needs Repair"] },
  { key: "interior", label: "Interior", options: ["Clean", "Needs Cleaning", "With Damage"] },
  { key: "tires", label: "Tires", options: ["Good", "Low Pressure", "Needs Replacement"] },
  { key: "lights", label: "Lights", options: ["Working", "Not Working"] },
];

export default function VehicleConditionStep({ condition, onConditionChange }) {
  return (
    <div className={stepCard.card}>
      <div className={styles.list}>
        {FIELDS.map((field) => (
          <div key={field.key} className={styles.row}>
            <h3 className={styles.rowLabel}>{field.label}</h3>
            <RadioOptionGroup
              name={field.key}
              options={field.options}
              value={condition[field.key]}
              onChange={(value) => onConditionChange(field.key, value)}
              layout="horizontal"
            />
          </div>
        ))}
      </div>
    </div>
  );
}