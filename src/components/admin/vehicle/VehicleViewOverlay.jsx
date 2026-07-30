import React, { useEffect } from "react";
import VehicleStatusBadge from "./VehicleStatusBadge";
import styles from "./VehicleViewOverlay.module.css";

function VehiclePlaceholderImage() {
  return (
    <svg viewBox="0 0 200 110" className={styles.placeholderSvg} xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="200" height="110" fill="#f0f1f3" />
      <path
        d="M30 75h140M40 75l8-22a8 8 0 0 1 7-5h30a8 8 0 0 1 7 5l8 22M55 75v-8h90v8"
        stroke="#c7cad0"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="78" r="8" fill="#c7cad0" />
      <circle cx="140" cy="78" r="8" fill="#c7cad0" />
    </svg>
  );
}

export default function VehicleViewOverlay({ vehicle, onClose, onEdit }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!vehicle) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className={styles.imageWrap}>
          <VehicleStatusBadge status={vehicle.status} />
          {vehicle.imageUrl ? (
            <img src={vehicle.imageUrl} alt={vehicle.name} className={styles.photo} />
          ) : (
            <VehiclePlaceholderImage />
          )}
        </div>

        <div className={styles.body}>
          <h2 className={styles.name}>{vehicle.name}</h2>
          <p className={styles.plate}>{vehicle.plate}</p>

          <div className={styles.specsGrid}>
            <div>
              <p className={styles.specLabel}>Transmission</p>
              <p className={styles.specValue}>{vehicle.transmission}</p>
            </div>
            <div>
              <p className={styles.specLabel}>Seats</p>
              <p className={styles.specValue}>{vehicle.seats}</p>
            </div>
            <div>
              <p className={styles.specLabel}>Type</p>
              <p className={styles.specValue}>{vehicle.type}</p>
            </div>
            <div>
              <p className={styles.specLabel}>Price per Day</p>
              <p className={styles.specValue}>₱{vehicle.price.toLocaleString()}</p>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.closeTextBtn} onClick={onClose}>
              Close
            </button>
            <button type="button" className={styles.editBtn} onClick={() => onEdit(vehicle)}>
              Edit Vehicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}