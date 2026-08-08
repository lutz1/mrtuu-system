import React from "react";
import RadioOptionGroup from "./RadioOptionGroup";
import stepCard from "./StepCard.module.css";
import styles from "./FuelDocumentsStep.module.css";

const FUEL_LEVELS = ["Empty", "1/4", "1/2", "3/4", "Full"];

const DOCUMENTS = [
  { key: "orcr", label: "OR/CR" },
  { key: "insurance", label: "Insurance" },
  { key: "officialReceipt", label: "Official Receipt" },
  { key: "vehicleRegistration", label: "Vehicle Registration" },
];

export default function FuelDocumentsStep({ fuelLevel, onFuelLevelChange, documents, onDocumentChange }) {
  return (
    <div className={styles.columns}>
      <div className={stepCard.card}>
        <h2 className={stepCard.title}>Fuel Level</h2>
        <RadioOptionGroup name="fuelLevel" options={FUEL_LEVELS} value={fuelLevel} onChange={onFuelLevelChange} />
      </div>

      <div className={stepCard.card}>
        <h2 className={stepCard.title}>Vehicle Documents</h2>
        <div className={styles.docList}>
          {DOCUMENTS.map((doc) => (
            <div key={doc.key} className={styles.docRow}>
              <span className={styles.docLabel}>{doc.label}</span>
              <RadioOptionGroup
                name={doc.key}
                options={["Present", "Not Present"]}
                value={documents[doc.key]}
                onChange={(value) => onDocumentChange(doc.key, value)}
                layout="horizontal"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}