import React from "react";
import styles from "./ContactMap.module.css";

const OFFICE_ADDRESS = "Pioneer Ave., Prk. Santa Cruz, Estrella St., Mankilam, Tagum City, Davao del Norte";

export default function ContactMap() {
  return (
    <div className={styles.mapWrapper}>
      <iframe
        title="Lyka's Car Rental office location"
        src={`https://www.google.com/maps?q=${encodeURIComponent(OFFICE_ADDRESS)}&output=embed`}
        className={styles.map}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}