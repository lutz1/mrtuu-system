import React from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CARS } from "../../data/cars";
import styles from "./PaymentSuccessPage.module.css";

function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export default function PaymentSuccessPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const car = CARS.find((c) => String(c.id) === id);

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

  const bookingRef = state?.bookingRef ?? "LYKA-0000-XX";
  const days = state?.days ?? 3;
  const pickupDate = state?.pickupDate ?? "";
  const returnDate = state?.returnDate ?? "";
  const location = state?.location ?? "Apokon, Tagum City";
  const dailyRate = state?.dailyRate ?? car.price;
  const subtotal = state?.subtotal ?? dailyRate * days;
  const feesAndTaxes = state?.feesAndTaxes ?? 650;
  const addonsTotal = state?.addonsTotal ?? 0;
  const total = state?.total ?? subtotal + feesAndTaxes + addonsTotal;
  const paymentMethod = state?.paymentMethod ?? "card";
  const cardLast4 = state?.cardLast4;

  const handleDownloadReceipt = () => {
    // No backend / PDF generation yet — placeholder for the real receipt export
    console.log("Downloading receipt", { bookingRef, car, total });
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <Navbar />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.successIconWrap}>
            <svg className={styles.starLeft} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l1.5 6L20 9l-6.5 1L12 16l-1.5-6L4 9l6.5-1L12 2z" />
            </svg>
            <svg className={styles.starRight} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l1.5 6L20 9l-6.5 1L12 16l-1.5-6L4 9l6.5-1L12 2z" />
            </svg>
            <div className={styles.checkCircle}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h1 className={styles.title}>Payment Successful!</h1>
          <p className={styles.subtitle}>Your car is ready and waiting for you.</p>

          <div className={styles.refPill}>
            Booking Ref: <strong>{bookingRef}</strong>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.carHeader}>
              <img src={car.images[0]} alt={car.name} className={styles.carThumb} />
              <div>
                <h2 className={styles.carName}>{car.name}</h2>
                <p className={styles.carSpecsLine}>
                  {car.transmission} • {car.fuelType} • {car.seats} Seats • {car.mileage} km
                </p>
              </div>
            </div>

            <div className={styles.detailsRow}>
              <div>
                <span className={styles.detailLabel}>RENTAL DURATION</span>
                <span className={styles.detailValue}>
                  {days} Day{days !== 1 ? "s" : ""} ({formatDateShort(pickupDate)} -{" "}
                  {formatDateShort(returnDate)})
                </span>
              </div>
              <div className={styles.detailRight}>
                <span className={styles.detailLabel}>PICKUP LOCATION</span>
                <span className={styles.detailValue}>{location}</span>
              </div>
            </div>

            <div className={styles.breakdown}>
              <div className={styles.breakdownRow}>
                <span>
                  Daily Rate (₱{dailyRate.toLocaleString()} × {days})
                </span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Insurance &amp; Coverage</span>
                <span>₱{feesAndTaxes.toLocaleString()}</span>
              </div>
              {addonsTotal > 0 && (
                <div className={styles.breakdownRow}>
                  <span>Add-ons</span>
                  <span>₱{addonsTotal.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Paid</span>
              <span className={styles.totalAmount}>₱{total.toLocaleString()}</span>
            </div>

            <div className={styles.paymentMethodRow}>
              <span className={styles.paymentMethodInfo}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                {paymentMethod === "card"
                  ? `Visa ending in **** ${cardLast4 || "6769"}`
                  : "Paid via GCash"}
              </span>
              <svg className={styles.verifiedIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2l2.4 1.3 2.7-.3 1.1 2.5 2.5 1.1-.3 2.7L21.7 12l-1.3 2.4.3 2.7-2.5 1.1-1.1 2.5-2.7-.3L12 22l-2.4-1.3-2.7.3-1.1-2.5-2.5-1.1.3-2.7L2.3 12l1.3-2.4-.3-2.7 2.5-1.1L6.9 3.3l2.7.3L12 2z"
                  fill="#f0a93a"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className={styles.actionsRow}>
            <button type="button" className={styles.downloadBtn} onClick={handleDownloadReceipt}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 3v12m0 0l-4-4m4 4l4-4M5 19h14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download Receipt (PDF)
            </button>
            <button type="button" className={styles.homeBtn} onClick={() => navigate("/")}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 11l8-7 8 7M6 10v9h12v-9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Home
            </button>
          </div>

          <p className={styles.helpText}>
            Need help with your booking?
            <br />
            <a href="#contact" className={styles.helpLink}>
              Contact 24/7 Support
            </a>
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
}