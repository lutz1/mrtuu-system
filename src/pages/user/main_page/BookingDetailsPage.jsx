import { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/user/frontpage/Navbar";
import Footer from "../../../components/user/frontpage/Footer";
import DriverInfoForm from "../../../components/user/booking/DriverInfoForm";
import AddonsList, {
  ADDONS,
} from "../../../components/user/booking/AddonsList";
import BookingSummarySidebar from "../../../components/user/booking/BookingSummarySidebar";
import HelpBox from "../../../components/user/HelpBox";
import styles from "./BookingDetailsPage.module.css";
import { useVehicles } from "../../../context/VehiclesContext";
import PaymentBreakdown from "../../../components/user/booking/PaymentBreakdown";
import ReviewAndPay from "../../../components/user/booking/ReviewAndPay";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getVehicleById } = useVehicles();
  const car = getVehicleById(id);

  // -------------------------------------------------------------
  // ALL HOOKS MUST STAY AT THE TOP BEFORE ANY CONDITIONAL RETURNS
  // -------------------------------------------------------------
  const [selectedAddons, setSelectedAddons] = useState({});
  const [driver, setDriver] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseNo: "",
  });
  const [files, setFiles] = useState({ driversLicense: null, validId: null });
  const [agreed, setAgreed] = useState(false);

  // Fallback return if vehicle isn't found
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

  // Fallback values if someone lands here directly without navigation state
  const days = state?.days ?? 3;
  const pickupDate = state?.pickupDate ?? "";
  const returnDate = state?.returnDate ?? "";
  const location = state?.location ?? "Apokon, Tagum City";
  const subtotal = state?.subtotal ?? car.price * days;
  const feesAndTaxes =
    (state?.insuranceFee ?? 450) + (state?.serviceFee ?? 200);

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

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
        files,
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
              Please provide your details and choose any extras for your
              journey.
            </p>
          </div>

          <div className={styles.mainGrid}>
            <div className={styles.mainColumn}>
              <DriverInfoForm
                driver={driver}
                onChange={handleDriverChange}
                files={files}
                onFileChange={handleFileChange}
              />
              <AddonsList
                selectedAddons={selectedAddons}
                onToggle={toggleAddon}
              />
              <ReviewAndPay
                total={total}
                agreed={agreed}
                onAgreeChange={setAgreed}
                onPay={handleProceedToPayment}
                disabled={!driver.fullName || !files.driversLicense || !files.validId}
              />
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
              <PaymentBreakdown total={total} />
              <HelpBox />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}