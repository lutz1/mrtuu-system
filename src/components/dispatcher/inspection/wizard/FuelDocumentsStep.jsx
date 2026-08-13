import React from "react";
import RadioOptionGroup from "./RadioOptionGroup";
import stepCard from "./StepCard.module.css";
import styles from "./FuelDocumentsStep.module.css";

const DOCUMENTS = [
  { key: "orcr", label: "OR/CR" },
  { key: "insurance", label: "Insurance" },
  { key: "officialReceipt", label: "Official Receipt" },
  { key: "vehicleRegistration", label: "Vehicle Registration" },
];

export default function FuelDocumentsStep({
  mode = "pickup",
  preRentData = null,
  fuelLiters,
  isFullTank,
  onFuelLitersChange,
  onFullTankToggle,
  documents,
  onDocumentChange,
}) {
  const isReturnMode = mode === "return";
  const pickupFuel = preRentData?.fuelLevel;

  return (
    <div className={styles.columns}>
      {/* Fuel Level Card */}
      <div className={stepCard.card}>
        <h2 className={stepCard.title}>Fuel Level</h2>

        {isReturnMode && pickupFuel && (
          <div className={styles.baselineFuelBox}>
            <span className={styles.baselineFuelLabel}>Pickup Fuel Level:</span>
            <span className={styles.baselineFuelValue}>{pickupFuel}</span>
          </div>
        )}

        <div className={styles.fuelInputGroup}>
          <label className={styles.inputLabel}>
            Fuel Quantity (Liters) <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWithUnit}>
            <input
              type="number"
              min="0"
              step="0.1"
              disabled={isFullTank}
              className={styles.numberInput}
              placeholder={isFullTank ? "Full Tank Selected" : "e.g. 45.5"}
              value={isFullTank ? "" : fuelLiters}
              onChange={(e) => onFuelLitersChange(e.target.value)}
            />
            <span className={styles.unitBadge}>L</span>
          </div>

          <label className={styles.fullTankToggle}>
            <input
              type="checkbox"
              checked={isFullTank}
              onChange={(e) => onFullTankToggle(e.target.checked)}
            />
            <span className={styles.toggleText}>Vehicle has a Full Tank</span>
          </label>
        </div>
      </div>

      {/* Vehicle Documents Card (Pickup Mode or Context View) */}
      {!isReturnMode && (
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
      )}
    </div>
  );
}