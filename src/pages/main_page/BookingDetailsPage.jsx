import React, { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CARS } from "../../data/cars";
import styles from "./BookingDetailsPage.module.css";

const ADDONS = [
  {
    id: "premiumInsurance",
    name: "Premium Insurance",
    description: "Zero deductible and full coverage",
    price: 1500,
  },
  {
    id: "gpsNavigation",
    name: "GPS Navigation",
    description: "Latest satellite map with traffic",
    price: 500,
  },
  {
    id: "childSeat",
    name: "Child Seat",
    description: "ISOFIX safety standard seat",
    price: 1000,
  },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const car = CARS.find((c) => String(c.id) === id);

  const [selectedAddons, setSelectedAddons] = useState({});
  const [driver, setDriver] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseNo: "",
  });

  if (!car) {
    return (
      <div className={styles.page}>
        <div className={styles.stickyHeader}>
          <Navbar />
        </div>
        <div className={styles.pageContent}>
          <div className={styles.notFound}>
            <p>We couldn't find that booking.</p>
            <Link to="/showroom" className={styles.notFoundLink}>
              Back to Showroom
            </Link>
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
  const feesAndTaxes =
    (state?.insuranceFee ?? 450) + (state?.serviceFee ?? 200);

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
    state: {
      driver,
      location,
      pickupDate,
      returnDate,
      days,
      subtotal,
      feesAndTaxes,
      addonsTotal,
      total,
    },
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
            <p className={styles.subtitle}>
              Please provide your details and choose any extras for your journey.
            </p>
          </div>

          <div className={styles.mainGrid}>
            <div className={styles.mainColumn}>
              {/* Driver Information */}
              <section className={styles.card}>
                <div className={styles.cardHeading}>
                  <svg className={styles.headingIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h2 className={styles.cardTitle}>Driver Information</h2>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      className={styles.formInput}
                      placeholder="Selsite Tortskie"
                      value={driver.fullName}
                      onChange={(e) => handleDriverChange("fullName", e.target.value)}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={styles.formInput}
                      placeholder="tortskie@gmail.com"
                      value={driver.email}
                      onChange={(e) => handleDriverChange("email", e.target.value)}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={styles.formInput}
                      placeholder="09957463523"
                      value={driver.phone}
                      onChange={(e) => handleDriverChange("phone", e.target.value)}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="licenseNo">
                      Driver's License No.
                    </label>
                    <input
                      id="licenseNo"
                      type="text"
                      className={styles.formInput}
                      placeholder="ABCD12344567"
                      value={driver.licenseNo}
                      onChange={(e) => handleDriverChange("licenseNo", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Optional Add-ons */}
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
                        {addon.id === "premiumInsurance" && (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {addon.id === "gpsNavigation" && (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                            <path
                              d="M15.5 8.5l-2 5-5 2 2-5 5-2z"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {addon.id === "childSeat" && (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                            <circle cx="9" cy="10.5" r="1" fill="currentColor" />
                            <circle cx="15" cy="10.5" r="1" fill="currentColor" />
                            <path
                              d="M8.5 14.5c1 1 2.2 1.5 3.5 1.5s2.5-.5 3.5-1.5"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </div>

                      <div className={styles.addonInfo}>
                        <span className={styles.addonName}>{addon.name}</span>
                        <span className={styles.addonDescription}>{addon.description}</span>
                      </div>

                      <span className={styles.addonPrice}>
                        ₱{addon.price.toLocaleString()} / day
                      </span>

                      <input
                        type="checkbox"
                        className={styles.addonCheckbox}
                        checked={!!selectedAddons[addon.id]}
                        onChange={() => toggleAddon(addon.id)}
                      />
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar summary */}
            <div className={styles.sidebar}>
              <aside className={styles.summaryCard}>
                <img
                  src={car.images[0]}
                  alt={car.name}
                  className={styles.summaryImage}
                />

                <div className={styles.summaryBody}>
                  <h3 className={styles.summaryCarName}>{car.name}</h3>
                  <div className={styles.summaryLocation}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    {location}
                  </div>

                  <div className={styles.summaryDates}>
                    <div>
                      <span className={styles.summaryDateLabel}>PICK-UP</span>
                      <span className={styles.summaryDateValue}>
                        {formatDate(pickupDate)}
                      </span>
                    </div>
                    <div className={styles.summaryDateRight}>
                      <span className={styles.summaryDateLabel}>DROP-OFF</span>
                      <span className={styles.summaryDateValue}>
                        {formatDate(returnDate)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.summaryBreakdown}>
                    <div className={styles.summaryRow}>
                      <span>Rental ({days} day{days !== 1 ? "s" : ""})</span>
                      <span>₱{subtotal.toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Fees &amp; Taxes</span>
                      <span>₱{feesAndTaxes.toLocaleString()}</span>
                    </div>
                    {addonsTotal > 0 && (
                      <div className={styles.summaryRow}>
                        <span>Add-ons</span>
                        <span>₱{addonsTotal.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.summaryTotalRow}>
                    <span className={styles.summaryTotalLabel}>Total Price</span>
                    <span className={styles.summaryTotalAmount}>
                      ₱{total.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={styles.proceedBtn}
                    onClick={handleProceedToPayment}
                  >
                    Proceed to Payment
                  </button>
                  <p className={styles.termsNote}>
                    By clicking proceed, you agree to our Rental Terms &amp; Conditions.
                  </p>
                </div>
              </aside>

              <div className={styles.helpBox}>
                <svg className={styles.helpIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M9.5 9.2a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .8-1 1.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
                </svg>
                <div>
                  <p className={styles.helpTitle}>Need help?</p>
                  <p className={styles.helpText}>
                    Call us 24/7 at 099999999 or Message on our FB Page: Lyka's Car Rental
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}