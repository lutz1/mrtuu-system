import React from "react";
import styles from "./InspectionStepIndicator.module.css";

const STEPS = [
  { id: 1, label: "Vehicle Photos" },
  { id: 2, label: "Fuel & Documents" },
  { id: 3, label: "Vehicle Condition" },
  { id: 4, label: "Review & Submit" },
];

export default function InspectionStepIndicator({ currentStep }) {
  return (
    <div className={styles.wrap}>
      {STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className={styles.step}>
            <span
              className={`${styles.circle} ${
                step.id === currentStep ? styles.circleActive : step.id < currentStep ? styles.circleDone : ""
              }`}
            >
              {step.id}
            </span>
            <span className={styles.label}>{step.label}</span>
          </div>
          {i < STEPS.length - 1 && <span className={styles.connector} />}
        </React.Fragment>
      ))}
    </div>
  );
}