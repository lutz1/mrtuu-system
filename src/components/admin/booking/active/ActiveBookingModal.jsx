import { useEffect, useMemo, useState } from "react";
import { useAdminBookings } from "../../../../context/AdminBookingsContext";
import { useStaff } from "../../../../context/StaffContext";
import { useToast } from "../../../../context/ToastContext";
import styles from "./ActiveBookingModal.module.css";

function parseDateOnly(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Handles both "HH:MM" (24h) and "h:mm AM/PM" (12h) time strings, since
// we don't have visibility into CustomTimePicker's exact stored format.
function parseTimeIntoDate(baseDate, timeStr) {
  if (!baseDate) return null;
  if (!timeStr) return baseDate;
  const next = new Date(baseDate);

  const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    next.setHours(Number(match24[1]), Number(match24[2]), 0, 0);
    return next;
  }

  const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hours = Number(match12[1]) % 12;
    if (match12[3].toUpperCase() === "PM") hours += 12;
    next.setHours(hours, Number(match12[2]), 0, 0);
    return next;
  }

  return baseDate;
}

function getBookingDateTime(dateStr, timeStr) {
  return parseTimeIntoDate(parseDateOnly(dateStr), timeStr);
}

function formatFull(date) {
  if (!date) return "—";
  const datePart = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const timePart = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${datePart} ${timePart}`;
}

function diffParts(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function ActiveBookingModal({ booking, onClose }) {
  const { flagReturnRequested } = useAdminBookings();
  const { staffProfile } = useStaff();
  const { showToast } = useToast();
  const [now, setNow] = useState(() => new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live-updating countdown — ticks every second while the modal is open.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const pickupDateTime = useMemo(
    () => getBookingDateTime(booking.pickupDate, booking.pickupTime),
    [booking.pickupDate, booking.pickupTime]
  );
  const returnDateTime = useMemo(
    () => getBookingDateTime(booking.returnDate, booking.returnTime),
    [booking.returnDate, booking.returnTime]
  );

  const elapsed = pickupDateTime ? diffParts(now - pickupDateTime) : null;
  const remainingMs = returnDateTime ? returnDateTime - now : null;
  const isOverdue = remainingMs !== null && remainingMs < 0;
  const remaining = remainingMs !== null ? diffParts(Math.abs(remainingMs)) : null;

  const alreadyRequested = !!booking.dispatchChecklist?.returnRequested;

  const handleConfirmReturned = async () => {
    setIsSubmitting(true);
    try {
      await flagReturnRequested(booking.id, { staffUid: staffProfile?.uid });
      showToast(`${booking.id} flagged as returned — awaiting dispatcher inspection.`, { type: "success" });
      onClose();
    } catch (err) {
      console.error("Failed to flag booking as returned:", err);
      showToast("Failed to update this booking. Please try again.", { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal} >
        <div className={styles.header}>
          <h2 className={styles.title}>Booking Details</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.topRow}>
            <div className={styles.topCol}>
              <p className={styles.label}>Booking ID</p>
              <p className={styles.bookingId}>{booking.id}</p>
              <span className={styles.statusBadge}>{booking.status === "ongoing" ? "Ongoing" : booking.status}</span>
            </div>

            <div className={styles.topCol}>
              <p className={styles.label}>Accurate Rent Time</p>
              <div className={styles.countdownBox}>
                {elapsed ? (
                  <>
                    <div className={styles.countdownSeg}>
                      <span className={styles.countdownNum}>{elapsed.days}</span>
                      <span className={styles.countdownUnit}>DAYS</span>
                    </div>
                    <span className={styles.countdownColon}>:</span>
                    <div className={styles.countdownSeg}>
                      <span className={styles.countdownNum}>{pad(elapsed.hours)}</span>
                      <span className={styles.countdownUnit}>HRS</span>
                    </div>
                    <span className={styles.countdownColon}>:</span>
                    <div className={styles.countdownSeg}>
                      <span className={styles.countdownNum}>{pad(elapsed.minutes)}</span>
                      <span className={styles.countdownUnit}>MINS</span>
                    </div>
                    <span className={styles.countdownColon}>:</span>
                    <div className={styles.countdownSeg}>
                      <span className={styles.countdownNum}>{pad(elapsed.seconds)}</span>
                      <span className={styles.countdownUnit}>SECS</span>
                    </div>
                  </>
                ) : (
                  <span className={styles.countdownUnavailable}>—</span>
                )}
              </div>
              <p className={styles.startedText}>
                {pickupDateTime ? `Started on ${formatFull(pickupDateTime)}` : "Start time unavailable"}
              </p>
            </div>

            <div className={styles.topCol}>
              <p className={styles.label}>Expected Return</p>
              <p className={styles.value}>{formatFull(returnDateTime)}</p>
              <div className={styles.divider} />
              <p className={styles.label}>Time Remaining</p>
              {remaining ? (
                <p className={`${styles.remainingValue} ${isOverdue ? styles.remainingOverdue : ""}`}>
                  {isOverdue && "Overdue by "}
                  {remaining.days}D {remaining.hours}H {remaining.minutes}M
                </p>
              ) : (
                <p className={styles.remainingValue}>—</p>
              )}
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Customer Information</h3>
              <div className={styles.infoRow}>
                <span className={styles.infoIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                {booking.customer}
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C10.7 19.5 4.5 13.3 4.5 6c0-1.1.9-2 2-2z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {booking.phone}
              </div>
              {booking.driver?.email && (
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M4.5 6.5l7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {booking.driver.email}
                </div>
              )}
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Vehicle</h3>
              <p className={styles.vehicleName}>{booking.vehicle}</p>
              <div className={styles.divider} />
              <p className={styles.label}>Plate No.</p>
              <p className={styles.value}>{booking.plate}</p>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Rental Information</h3>
              <div className={styles.rentalRow}>
                <span>Rental Date</span>
                <span className={styles.rentalValue}>{formatFull(pickupDateTime)}</span>
              </div>
              <div className={styles.rentalRow}>
                <span>Return Date</span>
                <span className={styles.rentalValue}>{formatFull(returnDateTime)}</span>
              </div>
              <div className={styles.rentalRow}>
                <span>Duration</span>
                <span className={styles.rentalValue}>
                  {booking.days ?? "—"} Day{(booking.days ?? 1) !== 1 ? "s" : ""}
                </span>
              </div>
              <div className={styles.rentalRow}>
                <span>Rate / Day</span>
                <span className={styles.rentalValue}>₱{(booking.dailyRate ?? 0).toLocaleString()}.00</span>
              </div>
              <div className={styles.rentalRow}>
                <span>Total Amount</span>
                <span className={styles.rentalValue}>₱{(booking.total ?? 0).toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          {/* TODO: booking.notes doesn't exist on any real booking doc yet —
              AdminNewBookingPage collects form.remarks but never sends it to
              addBooking, and the online-booking flow has no notes field at
              all. This section simply won't render until that's wired up. */}
          {booking.notes && (
            <div className={styles.notesCard}>
              <h3 className={styles.notesTitle}>Notes</h3>
              <p className={styles.notesText}>{booking.notes}</p>
            </div>
          )}

          <div className={styles.confirmCard}>
            <div>
              <h3 className={styles.confirmTitle}>Confirm Return</h3>
              <p className={styles.confirmText}>
                {alreadyRequested
                  ? "This booking has already been flagged as returned and is awaiting dispatcher inspection."
                  : "Click the button once the customer has returned the unit. This will flag the booking for the dispatcher's return inspection."}
              </p>
            </div>
            <button
              type="button"
              className={styles.confirmBtn}
              onClick={handleConfirmReturned}
              disabled={isSubmitting || alreadyRequested}
            >
              {alreadyRequested ? "Already Flagged" : isSubmitting ? "Confirming..." : "Confirm Returned"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}