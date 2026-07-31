import { Link, useParams } from "react-router-dom";
import Navbar from "../../../components/user/frontpage/Navbar";
import SearchFilterBar from "../../../components/user/SearchFilterBar";
import Breadcrumb from "../../../components/user/Breadcrumb";
import Gallery from "../../../components/user/account/Gallery";
import Features from "../../../components/user/Features";
import RentalPolicies from "../../../components/user/RentalPolicies";
import BookingPanel from "../../../components/user/booking/BookingPanel";
import Footer from "../../../components/user/frontpage/Footer";
import {
  IconTransmission,
  IconFuel,
  IconSeats,
  IconMileage,
} from "../../../components/user/icons";
import styles from "./VehicleOverviewPage.module.css";
import { useVehicles } from "../../../context/VehiclesContext.jsx";
import { RENTAL_POLICIES } from "../../../Data/rentalPolicies";

export default function VehicleOverviewPage() {
  const { id } = useParams();
  const { getVehicleById } = useVehicles();
  const car = getVehicleById(id);

  if (!car) {
    return (
      <div className={styles.page}>
        <div className={styles.stickyHeader}>
          <Navbar />
          <SearchFilterBar />
        </div>
        <div className={styles.pageContent}>
          <div className={styles.notFound}>
            <p>We couldn't find that vehicle.</p>
            <Link to="/showroom" className={styles.notFoundLink}>
              Back to Showroom
            </Link>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <Navbar />
        <SearchFilterBar />
      </div>

      <div className={styles.pageContent}>
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
                  <span className={styles.priceAmount}>
                    ₱{car.price.toLocaleString()}
                  </span>
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

            <BookingPanel car={car} />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
