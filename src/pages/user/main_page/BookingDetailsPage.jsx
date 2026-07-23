import React, { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/user/frontpage/Navbar";
import Footer from "../../../components/user/frontpage/Footer";
import { CARS } from "../../../data/cars";
import DriverInfoForm from "../../../components/user/booking/DriverInfoForm";
import AddonsList, { ADDONS } from "../../../components/user/booking/AddonsList";
import BookingSummarySidebar from "../../../components/user/booking/BookingSummarySidebar";
import HelpBox from "../../../components/user/HelpBox";
import styles from "./BookingDetailsPage.module.css";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const car = CARS.find((c) => String(c.id) === id);

  const [selectedAddons, setSelectedAddons] = useState({});
  const [driver, setDriver] = useState({ fullName: "", email: "", phone: "", licenseNo: "" });

  if (!car) {
    return (
      <div className={styles.page}>
        <div className={styles.stickyHeader}>
          <Navbar />
        </div>
        <div className={styles.pageContent}>
          <div className={styles.notFound}>
            <p>We couldn't find that booking.</p>
            <Link to="/showroom" className={styles.notFoundLink}>Back to Showroom</Link>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // Fallback values if someone lands here directly without booking state
  const days = state?.days ?? 3;
  const pickupDate = state?.pickupDate ?? "";
  const returnDate = state?.returnDate ?? "";
  const location = state?.location ?? "Apokon, Tagum City";
  const subtotal = state?.subtotal ?? car.price * days;
  const feesAndTaxes = (state?.insuranceFee ?? 450) + (state?.serviceFee ?? 200);

  const addonsTotal = ADDONS.reduce((sum, addon) => {
    return selectedAddons[addon.id] ? sum + addon.price * days : sum;
  }, 0);

  const total = subtotal + feesAndTaxes + addonsTotal;

  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) => ({ ...prev, [addonId]: !prev[addonId] }));
  };

  const handleDriverChange = (field, value) => {
    setDriver((prev) => ({ ...prev, [field]: value }));
  };

  const handleProceedToPayment = () => {
    navigate(`/payment/${car.id}`, {
      state: { driver, location, pickupDate, returnDate, days, subtotal, feesAndTaxes, addonsTotal, total },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <Navbar />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.pageHeading}>
            <h1 className={styles.title}>Complete Your Booking</h1>
            <p className={styles.subtitle}>Please provide your details and choose any extras for your journey.</p>
          </div>

          <div className={styles.mainGrid}>
            <div className={styles.mainColumn}>
              <DriverInfoForm driver={driver} onChange={handleDriverChange} />
              <AddonsList selectedAddons={selectedAddons} onToggle={toggleAddon} />
            </div>

            <div className={styles.sidebar}>
              <BookingSummarySidebar
                car={car}
                location={location}
                pickupDate={pickupDate}
                returnDate={returnDate}
                days={days}
                subtotal={subtotal}
                feesAndTaxes={feesAndTaxes}
                addonsTotal={addonsTotal}
                total={total}
                onProceed={handleProceedToPayment}
              />
              <HelpBox />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}