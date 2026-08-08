import React from "react";
import PhotoSlot from "./PhotoSlot";
import stepCard from "./StepCard.module.css";
import styles from "./VehiclePhotosStep.module.css";

const PHOTO_SLOTS = [
  { key: "front", label: "Front View" },
  { key: "back", label: "Back View" },
  { key: "left", label: "Left Side View" },
  { key: "right", label: "Right Side View" },
];

export default function VehiclePhotosStep({ photos, onPhotoSelect, onPhotoRemove, odometer, onOdometerChange }) {
  return (
    <div className={stepCard.card}>
      <div className={styles.photoGrid}>
        {PHOTO_SLOTS.map((slot) => (
          <PhotoSlot
            key={slot.key}
            label={slot.label}
            photo={photos[slot.key]}
            onSelect={(file) => onPhotoSelect(slot.key, file)}
            onRemove={() => onPhotoRemove(slot.key)}
          />
        ))}
      </div>

      <div className={styles.odometerField}>
        <label className={styles.odometerLabel}>
          Odometer Reading <span className={styles.required}>*</span>
        </label>
        <div className={styles.odometerInputWrap}>
          <input
            type="number"
            min="0"
            className={styles.odometerInput}
            placeholder="Enter odometer reading"
            value={odometer}
            onChange={(e) => onOdometerChange(e.target.value)}
          />
          <span className={styles.odometerUnit}>km</span>
        </div>
      </div>
    </div>
  );
}