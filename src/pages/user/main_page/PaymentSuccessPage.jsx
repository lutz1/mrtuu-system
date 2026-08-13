import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/user/frontpage/Navbar";
import Footer from "../../../components/user/frontpage/Footer";
import { useVehicles } from "../../../context/VehiclesContext";
import styles from "./PaymentSuccessPage.module.css";

function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function formatMileage(mileage) {
  if (!mileage || mileage === "unlimited") return "Unli km";
  return `${mileage} km`;
}

export default function PaymentSuccessPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getVehicleById } = useVehicles();
  const car = getVehicleById(id);

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
  const subtotal = state?.subtotal ?? car.price * days;
  const feesAndTaxes = state?.feesAndTaxes ?? 650;
  const addonsTotal = state?.addonsTotal ?? 0;
  const total = state?.total ?? subtotal + feesAndTaxes + addonsTotal;
  const cardLast4 = state?.cardLast4 ?? "6769";

  const paidAmount = Math.round(total / 2);
  const pendingAmount = total - paidAmount;

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
          <div className={styles.statusIconWrap}>
            <svg className={styles.starLeft} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l1.5 6L20 9l-6.5 1L12 16l-1.5-6L4 9l6.5-1L12 2z" />
            </svg>
            <svg className={styles.starRight} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l1.5 6L20 9l-6.5 1L12 16l-1.5-6L4 9l6.5-1L12 2z" />
            </svg>
            <div className={styles.clockCircle}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8.5" stroke="#ffffff" strokeWidth="2" />
                <path d="M12 7.5V12l3 2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h1 className={styles.title}>Booking Pending Approval</h1>
          <p className={styles.subtitle}>
            Your booking has been received and is now being reviewed by our team.
          </p>

          <div className={styles.refPill}>
            Booking Ref: <strong>{bookingRef}</strong>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.carHeader}>
              <img src={car.images[0]} alt={car.name} className={styles.carThumb} />
              <div>
                <h2 className={styles.carName}>{car.name}</h2>
                <p className={styles.carSpecsLine}>
                  {car.transmission} • {car.fuelType} • {car.seats} Seats •{" "}
                  {formatMileage(car.mileage)}
                </p>
              </div>
            </div>

            <div className={styles.detailsRow}>
              <div>
                <span className={styles.detailLabel}>RENTAL DURATION</span>
                <span className={styles.detailValue}>
                  {days} Day{days !== 1 ? "s" : ""} (
                  {formatDateShort(pickupDate)} - {formatDateShort(returnDate)})
                </span>
              </div>
              <div className={styles.detailRight}>
                <span className={styles.detailLabel}>PICKUP LOCATION</span>
                <span className={styles.detailValue}>{location}</span>
              </div>
            </div>

            <div className={styles.paymentStatusList}>
              <div className={styles.paymentStatusRow}>
                <div className={`${styles.statusIconCircle} ${styles.statusIconPaid}`}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </div>
                <div className={styles.paymentStatusInfo}>
                  <span className={styles.paymentStatusLabel}>Pay Online (50%)</span>
                  <span className={styles.paymentStatusSub}>Your payment has been received.</span>
                </div>
                <div className={styles.paymentStatusRight}>
                  <span className={`${styles.paymentStatusAmount} ${styles.amountPaid}`}>
                    ₱{paidAmount.toLocaleString()}
                  </span>
                  <span className={`${styles.statusBadge} ${styles.badgePaid}`}>Paid</span>
                </div>
              </div>

              <div className={styles.paymentStatusRow}>
                <div className={`${styles.statusIconCircle} ${styles.statusIconPending}`}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M3.5 19c.8-3.4 3.2-5.2 5.5-5.2s4.7 1.8 5.5 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M16.5 8h3.5M18.25 6.25v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <div className={styles.paymentStatusInfo}>
                  <span className={styles.paymentStatusLabel}>Pay at Front Desk (50%)</span>
                  <span className={styles.paymentStatusSub}>Pay the remaining amount when you pick up the vehicle.</span>
                </div>
                <div className={styles.paymentStatusRight}>
                  <span className={`${styles.paymentStatusAmount} ${styles.amountPending}`}>
                    ₱{pendingAmount.toLocaleString()}
                  </span>
                  <span className={`${styles.statusBadge} ${styles.badgePending}`}>Pending</span>
                </div>
              </div>
            </div>

            <div className={styles.totalDivider} />

            <div className={styles.totalAmountRow}>
              <span className={styles.totalLabel}>Total Amount</span>
              <span className={styles.totalAmount}>₱{total.toLocaleString()}</span>
            </div>

            <div className={styles.reminderBox}>
              <svg className={styles.reminderIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 11v5.5M12 8v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <div className={styles.reminderText}>
                <p className={styles.reminderTitle}>Important Reminder</p>
                <p className={styles.reminderBody}>
                  Please proceed to Lykas Car Rental at the scheduled pick-up date. Present a
                  valid ID and complete the payment of the remaining 50% at our front desk to
                  claim your vehicle.
                </p>
              </div>
              <svg className={styles.reminderIllustration} viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="15" y="25" width="70" height="35" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M15 25l10-15h50l10 15" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M35 60V42h30v18" stroke="currentColor" strokeWidth="2" />
                <path d="M8 60h84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div className={styles.locationBox}>
              <div className={styles.locationInfo}>
                <svg className={styles.locationPin} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <div>
                  <p className={styles.locationTitle}>Lykas Car Rental Location</p>
                  <p className={styles.locationAddress}>
                    Purok 2, Apokon, Tagum City, Davao del Norte 8100
                  </p>
                  <p className={styles.locationHours}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M12 8v4l2.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    Operating Hours: 8:00 AM – 6:00 PM (Mon – Sun)
                  </p>
                </div>
              </div>
              <div className={styles.mapPreview}>
                <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" className={styles.mapSvg}>
                  <rect width="120" height="90" fill="var(--color-input-bg)" />
                  <path d="M0 55h120M45 0v90" stroke="var(--color-border)" strokeWidth="1.5" />
                </svg>
                <span className={styles.mapPinLabel}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C7.6 2 4 5.6 4 10c0 5.6 8 12 8 12s8-6.4 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                  Lykas Car Rental
                </span>
              </div>
            </div>

            <div className={styles.stepsSection}>
              <p className={styles.stepsTitle}>What happens next?</p>
              <p className={styles.stepsSubtitle}>Here's what you can expect:</p>

              <div className={styles.stepsRow}>
                <div className={styles.stepItem}>
                  <div className={styles.stepIconWrap} data-variant="review">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9" cy="8" r="2.7" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4 18c.7-3 2.6-4.5 5-4.5s4.3 1.5 5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="16.5" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M14.5 18c.5-2.2 1.9-3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className={styles.stepNumber}>1</span>
                  </div>
                  <p className={styles.stepLabel}>Our team will review your booking and documents.</p>
                </div>

                <span className={styles.stepConnector} />

                <div className={styles.stepItem}>
                  <div className={styles.stepIconWrap} data-variant="notify">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4 6.5l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className={styles.stepNumber}>2</span>
                  </div>
                  <p className={styles.stepLabel}>You will receive a notification once your booking is approved.</p>
                </div>

                <span className={styles.stepConnector} />

                <div className={styles.stepItem}>
                  <div className={styles.stepIconWrap} data-variant="pay">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3.5" y="6.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="16.5" cy="12.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className={styles.stepNumber}>3</span>
                  </div>
                  <p className={styles.stepLabel}>Pay the other half at our front desk to confirm your booking.</p>
                </div>

                <span className={styles.stepConnector} />

                <div className={styles.stepItem}>
                  <div className={styles.stepIconWrap} data-variant="dispatch">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 16v-3.5l1.8-4a2 2 0 0 1 1.9-1.3h8.6a2 2 0 0 1 1.9 1.3l1.8 4V16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      <path d="M4 16h16M6.5 16v1.8M17.5 16v1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="7.5" cy="13.2" r="1" fill="currentColor" />
                      <circle cx="16.5" cy="13.2" r="1" fill="currentColor" />
                    </svg>
                    <span className={styles.stepNumber}>4</span>
                  </div>
                  <p className={styles.stepLabel}>Our dispatcher will inspect the unit before turnover.</p>
                </div>
              </div>
            </div>

            <div className={styles.secureRow}>
              <svg className={styles.secureIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="10.5" width="14" height="9.5" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 10.5V7.5a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className={styles.secureText}>
                Your payment is secure.
                <br />
                We use industry-standard encryption to protect your information.
              </span>
              <span className={styles.paidUsing}>
                Paid using <strong>VISA</strong> ending in •••• {cardLast4}
              </span>
            </div>
          </div>

          <div className={styles.actionsRow}>
            <button type="button" className={styles.downloadBtn} onClick={handleDownloadReceipt}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download Receipt (PDF)
            </button>
            <button type="button" className={styles.homeBtn} onClick={() => navigate("/")}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 11l8-7 8 7M6 10v9h12v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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