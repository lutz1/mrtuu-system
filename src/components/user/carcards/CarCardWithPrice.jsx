import { Link } from "react-router-dom";
import { IconTransmission, IconFuel, IconSeats, IconMileage } from "../icons";
import styles from "./CarCardWithPrice.module.css";

export default function CarCardWithPrice({ car }) {
  if (!car) return null;

  const imageSrc = car.images?.[0] || "/placeholder-car.png";
  const price = Number(car.price) || 0;

  return (
    <article className={styles.carCard}>
      <div className={styles.carImageWrapper}>
        <img
          className={styles.carImage}
          src={imageSrc}
          alt={car.name || "Vehicle"}
        />
      </div>
      <div className={styles.carBody}>
        <div className={styles.carTitleRow}>
          <h3 className={styles.carName}>{car.name || "Unknown Vehicle"}</h3>
          <div className={styles.carPrice}>
            <span className={styles.priceAmount}>
              ₱{price.toLocaleString()}
            </span>
            <span className={styles.priceUnit}>per day</span>
          </div>
        </div>

        <div className={styles.carSpecs}>
          <span className={styles.specItem}>
            <IconTransmission className={styles.specIcon} />
            {car.transmission}
          </span>
          <span className={styles.specItem}>
            <IconFuel className={styles.specIcon} />
            {car.fuelType}
          </span>
          <span className={styles.specItem}>
            <IconSeats className={styles.specIcon} />
            {car.seats}
          </span>
          <span className={styles.specItem}>
            <IconMileage className={styles.specIcon} />
            {car.mileage} km
          </span>
        </div>

        <Link to={`/vehicle/${car.id}`} className={styles.viewDetailsBtn}>
          View Details
        </Link>
      </div>
    </article>
  );
}
