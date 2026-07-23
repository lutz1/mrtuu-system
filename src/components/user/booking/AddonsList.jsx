import React from "react";
import styles from "./AddonsList.module.css";

export const ADDONS = [
  { id: "premiumInsurance", name: "Premium Insurance", description: "Zero deductible and full coverage", price: 1500 },
  { id: "gpsNavigation", name: "GPS Navigation", description: "Latest satellite map with traffic", price: 500 },
  { id: "childSeat", name: "Child Seat", description: "ISOFIX safety standard seat", price: 1000 },
];

function AddonIcon({ addonId }) {
  if (addonId === "premiumInsurance") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  if (addonId === "gpsNavigation") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (addonId === "childSeat") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="9" cy="10.5" r="1" fill="currentColor" />
        <circle cx="15" cy="10.5" r="1" fill="currentColor" />
        <path d="M8.5 14.5c1 1 2.2 1.5 3.5 1.5s2.5-.5 3.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return null;
}

export default function AddonsList({ selectedAddons, onToggle }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <svg className={styles.headingIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <h2 className={styles.cardTitle}>Optional Add-ons</h2>
      </div>

      <div className={styles.addonsList}>
        {ADDONS.map((addon) => (
          <label key={addon.id} className={styles.addonRow}>
            <div className={styles.addonIconBox}>
              <AddonIcon addonId={addon.id} />
            </div>

            <div className={styles.addonInfo}>
              <span className={styles.addonName}>{addon.name}</span>
              <span className={styles.addonDescription}>{addon.description}</span>
            </div>

            <span className={styles.addonPrice}>₱{addon.price.toLocaleString()} / day</span>

            <input
              type="checkbox"
              className={styles.addonCheckbox}
              checked={!!selectedAddons[addon.id]}
              onChange={() => onToggle(addon.id)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}