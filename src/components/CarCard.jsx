import React from "react";
import { IconTransmission, IconSeats, IconLocation } from "./icons";
import styles from "./CarCard.module.css";

export default function CarCard({ car }) {
  return (
    <article className={styles.carCard}>
      <img className={styles.carImage} src={car.images[0]} alt={car.name} />
      <div className={styles.carBody}>
        <h3 className={styles.carName}>{car.name}</h3>
        <div className={styles.carSpecs}>
          <span className={styles.specItem}>
            <IconTransmission className={styles.specIcon} />
            {car.transmission}
          </span>
          <span className={styles.specItem}>
            <IconSeats className={styles.specIcon} />
            {car.seats}
          </span>
          <span className={styles.specItem}>
            <IconLocation className={styles.specIcon} />
            {car.mileage}
          </span>
        </div>
        <button className={styles.viewCarBtn}>View Car</button>
      </div>
    </article>
  );
}