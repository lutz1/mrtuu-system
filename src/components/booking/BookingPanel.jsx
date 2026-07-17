import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import styles from "./BookingPanel.module.css";

const INSURANCE_FEE = 450;
const SERVICE_FEE = 200;

function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function toISODate(date) {
  return date.toISOString().split("T")[0];
}

function addDays(dateStr, days) {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export default function BookingPanel({ car }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date();
  const todayISO = toISODate(today);
  const defaultReturn = addDays(todayISO, 3);

  const [location, setLocation] = useState("Apokon, Tagum City");
  const [pickupDate, setPickupDate] = useState(todayISO);
  const [returnDate, setReturnDate] = useState(defaultReturn);

  const pickupInputRef = useRef(null);
  const returnInputRef = useRef(null);

  const days = useMemo(() => {
    const start = new Date(pickupDate + "T00:00:00");
    const end = new Date(returnDate + "T00:00:00");
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [pickupDate, returnDate]);

  const dailyRate = car?.price ?? 0;
  const subtotal = dailyRate * days;
  const total = subtotal + INSURANCE_FEE + SERVICE_FEE;

  const handlePickupChange = (newDate) => {
    if (!newDate) return;
    const safeDate = newDate < todayISO ? todayISO : newDate;
    setPickupDate(safeDate);
    if (returnDate < safeDate) {
      setReturnDate(addDays(safeDate, 1));
    }
  };

  const handleReturnChange = (newDate) => {
    if (!newDate) return;
    const safeDate = newDate < pickupDate ? pickupDate : newDate;
    setReturnDate(safeDate);
  };

  const openPicker = (ref) => {
    const el = ref.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
      el.click();
    }
  };

  const handleBookNow = () => {
  setIsLoading(true);
  // Simulated delay — swap for a real API call once the backend exists
  setTimeout(() => {
    navigate(`/booking/${car.id}`, {
      state: {
        location,
        pickupDate,
        returnDate,
        days,
        dailyRate,
        subtotal,
        insuranceFee: INSURANCE_FEE,
        serviceFee: SERVICE_FEE,
        total,
      },
    });
  }, 900);
};

  return (
    <aside className={styles.bookingPanel}>
       {isLoading && <Loading message="Preparing your booking..." />}
      <h2 className={styles.heading}>Book This Car</h2>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="pickupLocation">
          Pickup Location
        </label>
        <div className={styles.inputWrapper}>
          <svg className={styles.fieldIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <input
            id="pickupLocation"
            type="text"
            className={styles.textInput}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.dateRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pickupDate">
            Pickup Date
          </label>
          <div
            className={styles.inputWrapper}
            onClick={() => openPicker(pickupInputRef)}
            role="button"
            tabIndex={0}
          >
            <svg className={styles.fieldIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className={styles.dateDisplay}>{formatDate(pickupDate)}</span>
            <input
              ref={pickupInputRef}
              id="pickupDate"
              type="date"
              className={styles.dateInput}
              value={pickupDate}
              min={todayISO}
              onChange={(e) => handlePickupChange(e.target.value)}
              aria-label="Pickup date"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="returnDate">
            Return Date
          </label>
          <div
            className={styles.inputWrapper}
            onClick={() => openPicker(returnInputRef)}
            role="button"
            tabIndex={0}
          >
            <svg className={styles.fieldIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className={styles.dateDisplay}>{formatDate(returnDate)}</span>
            <input
              ref={returnInputRef}
              id="returnDate"
              type="date"
              className={styles.dateInput}
              value={returnDate}
              min={pickupDate}
              onChange={(e) => handleReturnChange(e.target.value)}
              aria-label="Return date"
            />
          </div>
        </div>
      </div>

      <div className={styles.priceBreakdown}>
        <div className={styles.priceRow}>
          <span>
            ₱{dailyRate.toLocaleString()} × {days} day{days !== 1 ? "s" : ""}
          </span>
          <span>₱{subtotal.toLocaleString()}</span>
        </div>
        <div className={styles.priceRow}>
          <span>Comprehensive Insurance</span>
          <span>₱{INSURANCE_FEE.toLocaleString()}</span>
        </div>
        <div className={styles.priceRow}>
          <span>Pickup Service Fee</span>
          <span>₱{SERVICE_FEE.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total Price</span>
        <span className={styles.totalAmount}>₱{total.toLocaleString()}</span>
      </div>

      <button type="button" className={styles.bookBtn} onClick={handleBookNow}>
        Book Now
      </button>
      <p className={styles.noCard}>No credit card required for booking</p>
    </aside>
  );
}