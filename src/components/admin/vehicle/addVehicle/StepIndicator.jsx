import React from "react";
import styles from "./StepIndicator.module.css";

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Specifications" },
  { id: 3, label: "Features" },
  { id: 4, label: "Pricing" },
  { id: 5, label: "Review" },
];

export default function StepIndicator({ currentStep }) {
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
            <span className={styles.stepText}>
              <span className={styles.stepLabel}>{step.label}</span>
              <span className={styles.stepSubtitle}>Vehicle Details</span>
            </span>
          </div>
          {i < STEPS.length - 1 && <span className={styles.connector} />}
        </React.Fragment>
      ))}
    </div>
  );
}