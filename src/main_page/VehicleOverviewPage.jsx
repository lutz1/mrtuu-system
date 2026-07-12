import React from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchFilterBar from "../components/SearchFilterBar";
import Breadcrumb from "../components/Breadcrumb";
import Gallery from "../components/Gallery";
import Features from "../components/Features";
import RentalPolicies from "../components/RentalPolicies";
import BookingPanel from "../components/BookingPanel";
import Footer from "../components/Footer";
import { IconTransmission, IconFuel, IconSeats, IconMileage } from "../components/icons";
import { CARS, RENTAL_POLICIES } from "../data/cars";
import styles from "./VehicleOverviewPage.module.css";

export default function VehicleOverviewPage() {
  const { id } = useParams();
  const car = CARS.find((c) => String(c.id) === id);

  if (!car) {
    return (
      <div className={styles.page}>
        <Navbar />
        <SearchFilterBar />
        <div className={styles.notFound}>
          <p>We couldn't find that vehicle.</p>
          <Link to="/showroom" className={styles.notFoundLink}>
            Back to Showroom
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <SearchFilterBar />
      <Breadcrumb
        items={[
          { label: "Home", to: "/home" },
          { label: "Showroom", to: "/showroom" },
          { label: car.name },
        ]}
      />

      <div className={styles.contentWrapper}>
        <Gallery images={car.images} carName={car.name} />

        <div className={styles.mainGrid}>
          <div className={styles.mainColumn}>
            <div className={styles.titleRow}>
              <h1 className={styles.carName}>{car.name}</h1>
              <div className={styles.carPrice}>
                <span className={styles.priceAmount}>₱{car.price.toLocaleString()}</span>
                <span className={styles.priceUnit}>per day</span>
              </div>
            </div>

            <div className={styles.specsRow}>
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
                {car.seats} Seats
              </span>
              <span className={styles.specItem}>
                <IconMileage className={styles.specIcon} />
                {car.mileage} km
              </span>
            </div>

            <div className={styles.aboutSection}>
              <h2 className={styles.sectionHeading}>About this vehicle</h2>
              <p className={styles.aboutText}>{car.description}</p>
            </div>

            <Features features={car.features} />
            <RentalPolicies policies={RENTAL_POLICIES} />
          </div>

          <BookingPanel />
        </div>
      </div>

      <Footer />
    </div>
  );
}