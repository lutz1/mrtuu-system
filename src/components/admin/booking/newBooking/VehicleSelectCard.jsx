import React from "react";
import styles from "./VehicleSelectCard.module.css";

function TransmissionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v18M7 8h10M7 16h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.4" fill="currentColor" />
      <circle cx="12" cy="16" r="1.4" fill="currentColor" />
    </svg>
  );
}

function SeatsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 19c1.2-4 3.4-6 6.5-6s5.3 2 6.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TypeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 15l1.5-5A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="15" width="18" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

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

export default function VehicleSelectCard({ vehicle, onSelect }) {

  const thumbnail = vehicle.images?.[0] || vehicle.imageUrl;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {thumbnail ? (
          <img src={thumbnail} alt={vehicle.name} className={styles.photo} />
        ) : (
          <VehiclePlaceholderImage />
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{vehicle.name}</h3>
        <p className={styles.plate}>{vehicle.plate}</p>

        <div className={styles.specs}>
          <span className={styles.specItem}>
            <TransmissionIcon />
            {vehicle.transmission}
          </span>
          <span className={styles.specItem}>
            <SeatsIcon />
            {vehicle.seats} Seats
          </span>
          <span className={styles.specItem}>
            <TypeIcon />
            {vehicle.type}
          </span>
        </div>

        <p className={styles.price}>
          ₱{vehicle.price.toLocaleString()} <span className={styles.priceUnit}>/ day</span>
        </p>

        <button type="button" className={styles.selectBtn} onClick={onSelect}>
          Select
        </button>
      </div>
    </div>
  );
}