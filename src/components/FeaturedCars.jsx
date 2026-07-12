import React from "react";
import CarCard from "./CarCard";
import styles from "./FeaturedCars.module.css";

export default function FeaturedCars({ cars }) {
  return (
    <section className={styles.featuredCars}>
      <h2 className={styles.sectionTitleLight}>Featured Cars</h2>
      {cars.length > 0 ? (
        <div className={styles.carsGrid}>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
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