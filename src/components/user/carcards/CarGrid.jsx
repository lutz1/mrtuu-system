import CarCardWithPrice from "./CarCardWithPrice";
import styles from "./CarGrid.module.css";

export default function CarGrid({ cars }) {
  return (
    <section className={styles.carGridSection}>
      {cars.length > 0 ? (
        <div className={styles.carsGrid}>
          {cars.map((car) => (
            <CarCardWithPrice key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>
          No cars match your search. Try adjusting your filters.
        </p>
      )}
    </section>
  );
}