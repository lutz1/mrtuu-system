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

export default function VehiclePhotosStep({
  mode = "pickup",
  preRentData = null,
  photos,
  onPhotoSelect,
  onPhotoRemove,
  verifiedPhotos = {},
  onVerifyPhoto,
  odometer,
  onOdometerChange,
}) {
  const isReturnMode = mode === "return";
  const pickupPhotos = preRentData?.photos || {};
  const pickupOdometer = preRentData?.odometerReading
    ? Number(preRentData.odometerReading)
    : null;

  const currentOdometerNum = odometer ? Number(odometer) : null;
  const distanceDriven =
    isReturnMode && pickupOdometer !== null && currentOdometerNum !== null
      ? currentOdometerNum - pickupOdometer
      : null;

  const isInvalidOdometer = distanceDriven !== null && distanceDriven < 0;

  return (
    <div className={stepCard.card}>
      <div className={styles.photoGrid}>
        {PHOTO_SLOTS.map((slot) => {
          const pickupUrl = pickupPhotos[slot.key];

          return (
            <div key={slot.key} className={styles.slotWrapper}>
              {/* Show Baseline Pickup Photo in Return Mode */}
              {isReturnMode && (
                <div className={styles.pickupComparisonBox}>
                  <span className={styles.comparisonBadge}>Pickup Baseline</span>
                  {pickupUrl ? (
                    <img
                      src={pickupUrl}
                      alt={`Pickup ${slot.label}`}
                      className={styles.pickupImage}
                    />
                  ) : (
                    <div className={styles.noPhotoPlaceholder}>No Photo</div>
                  )}
                </div>
              )}

              {/* Photo Input / Camera Capture Slot */}
              <div className={styles.returnInputBox}>
                {isReturnMode && (
                  <span className={styles.comparisonBadgeActive}>
                    Return Inspection
                  </span>
                )}
                <PhotoSlot
                  label={slot.label}
                  photo={photos[slot.key]}
                  onSelect={(file) => onPhotoSelect(slot.key, file)}
                  onRemove={() => onPhotoRemove(slot.key)}
                />
              </div>

              {/* Verified Checklist Toggle (Return Mode Only) */}
              {isReturnMode && (
                <label className={styles.verifyCheckLabel}>
                  <input
                    type="checkbox"
                    className={styles.verifyCheckbox}
                    checked={!!verifiedPhotos[slot.key]}
                    onChange={(e) =>
                      onVerifyPhoto?.(slot.key, e.target.checked)
                    }
                  />
                  <span>Verified: No new damage observed</span>
                </label>
              )}
            </div>
          );
        })}
      </div>

      {/* Odometer Section */}
      <div className={styles.odometerSection}>
        {isReturnMode && pickupOdometer !== null && (
          <div className={styles.baselineInfoBox}>
            <span className={styles.baselineInfoLabel}>
              Pickup Odometer:
            </span>
            <span className={styles.baselineInfoValue}>
              {pickupOdometer.toLocaleString()} km
            </span>
          </div>
        )}

        <div className={styles.odometerField}>
          <label className={styles.odometerLabel}>
            {isReturnMode ? "Return Odometer Reading" : "Odometer Reading"}{" "}
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.odometerInputWrap}>
            <input
              type="number"
              min="0"
              className={`${styles.odometerInput} ${
                isInvalidOdometer ? styles.inputError : ""
              }`}
              placeholder="Enter odometer reading"
              value={odometer}
              onChange={(e) => onOdometerChange(e.target.value)}
            />
            <span className={styles.odometerUnit}>km</span>
          </div>
        </div>

        {/* Calculated Distance Driven Summary */}
        {isReturnMode && distanceDriven !== null && !isInvalidOdometer && (
          <div className={styles.distanceBadge}>
            <span>Distance Driven During Rental:</span>
            <strong>{distanceDriven.toLocaleString()} km</strong>
          </div>
        )}

        {/* Warning if return mileage is less than pickup */}
        {isInvalidOdometer && (
          <div className={styles.odometerWarning}>
            ⚠️ Return odometer reading cannot be less than the pickup reading (
            {pickupOdometer.toLocaleString()} km).
          </div>
        )}
      </div>
    </div>
  );
}