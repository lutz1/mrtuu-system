import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../dashboard/AdminLayout";
import { useAdminBookings } from "../../../../context/AdminBookingsContext";
import { useToast } from "../../../../context/ToastContext";
import styles from "./AdminBookingHistoryDetailsPage.module.css";

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateTime(value) {
  const d = toDate(value);
  if (!d) return "—";
  const datePart = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const timePart = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${datePart} ${timePart}`;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="#d18f1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminBookingHistoryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookingById } = useAdminBookings();
  const { showToast } = useToast();

  const booking = getBookingById(id);

  if (!booking) {
    return (
      <AdminLayout>
        <div className={styles.pageHeading}>
          <h1 className={styles.title}>Booking not found</h1>
          <p className={styles.subtitle}>This booking may have been removed, or hasn't finished loading yet.</p>
        </div>
      </AdminLayout>
    );
  }

  const preRent = booking.dispatchChecklist?.preRent;
  const postRent = booking.dispatchChecklist?.postRent;
  const pickupOdometer = preRent?.odometerReading;
  const returnOdometer = postRent?.odometerReading;
  const totalDistance =
    typeof pickupOdometer === "number" && typeof returnOdometer === "number"
      ? Math.max(0, returnOdometer - pickupOdometer)
      : null;

  const totalRentalFee = (booking.dailyRate ?? 0) * (booking.days ?? 1);
  const addonsTotal = Object.values(booking.addons ?? {}).reduce(
    (sum, v) => sum + (typeof v === "number" ? v : 0),
    0
  );

  // TODO: no real report-generation or PDF export exists yet.
  const handleViewReport = () => {
    showToast("Checklist / inspection report isn't built yet — coming soon.", { type: "info" });
  };
  const handlePrintReceipt = () => {
    showToast("Print/download receipt isn't built yet — coming soon.", { type: "info" });
  };

  const timelineEvents = [
    { label: "Booking Created", by: "Admin", at: booking.createdAt },
    booking.clearance?.checkedAt && { label: "Sent to Dispatcher", by: "Admin", at: booking.clearance.checkedAt },
    preRent?.submittedAt && { label: "Vehicle Released", by: "Dispatcher", at: preRent.submittedAt },
    postRent?.submittedAt && { label: "Vehicle Returned", by: "Dispatcher", at: postRent.submittedAt },
  ].filter(Boolean);

  return (
    <AdminLayout>
      <div className={styles.topBar}>
        <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div className={styles.topActions}>
          <button type="button" className={styles.reportBtn} onClick={handleViewReport}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="3.5" width="16" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 8.5h8M8 12.5h8M8 16.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            View Checklist / Inspection Report
          </button>
          <button type="button" className={styles.printBtn} onClick={handlePrintReceipt}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4.5" y="8.5" width="15" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M7 8.5V4.5h10v4M7 16.5v3h10v-3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            Print / Download Receipt
          </button>
        </div>
      </div>

      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Booking {booking.id}</h1>
        <p className={styles.breadcrumb}>
          <Link to="/admin/bookings" className={styles.breadcrumbLink}>
            Bookings
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span>Booking History</span>
          <span className={styles.breadcrumbSep}>/</span>
          <span>{booking.id}</span>
        </p>
      </div>

      <section className={styles.headerCard}>
        <div className={styles.headerCol}>
          <span className={styles.customerIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <p className={styles.customerName}>{booking.customer}</p>
            <p className={styles.customerLine}>{booking.phone}</p>
            {booking.driver?.email && <p className={styles.customerLine}>{booking.driver.email}</p>}
          </div>
        </div>

        <div className={styles.headerCol}>
          <div className={styles.kv}>
            <span>Booking ID</span>
            <strong>{booking.id}</strong>
          </div>
          <div className={styles.kv}>
            <span>Vehicle</span>
            <strong>
              {booking.vehicle} ({booking.plate})
            </strong>
          </div>
          <div className={styles.kv}>
            <span>Transmission</span>
            <strong>{booking.vehicleTransmission ?? "—"}</strong>
          </div>
          <div className={styles.kv}>
            <span>Fuel Type</span>
            <strong>{booking.vehicleFuelType ?? "—"}</strong>
          </div>
          <div className={styles.kv}>
            <span>Source</span>
            <strong>{booking.source}</strong>
          </div>
        </div>

        <div className={styles.headerCol}>
          <div className={styles.kv}>
            <span>Booking Date</span>
            <strong>{formatDateTime(booking.createdAt)}</strong>
          </div>
          <div className={styles.kv}>
            <span>Booking Period</span>
            <strong>
              {booking.pickupDateDisplay} {booking.pickupTime} - {booking.returnDateDisplay} {booking.returnTime}
            </strong>
          </div>
          <div className={styles.kv}>
            <span>Duration</span>
            <strong>{booking.days ?? 1} Days</strong>
          </div>
        </div>
      </section>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Rental Summary</h2>
          <div className={styles.summaryGrid}>
            <div>
              <p className={styles.summaryLabel}>Pick-up Date &amp; Time</p>
              <p className={styles.summaryValue}>
                {booking.pickupDateDisplay} {booking.pickupTime}
              </p>
            </div>
            <div>
              <p className={styles.summaryLabel}>Pick-up Odometer</p>
              <p className={styles.summaryValue}>
                {typeof pickupOdometer === "number" ? `${pickupOdometer.toLocaleString()} km` : "—"}
              </p>
            </div>
            <div>
              <p className={styles.summaryLabel}>Return Date &amp; Time</p>
              <p className={styles.summaryValue}>
                {booking.returnDateDisplay} {booking.returnTime}
              </p>
            </div>
            <div>
              <p className={styles.summaryLabel}>Return Odometer</p>
              <p className={styles.summaryValue}>
                {typeof returnOdometer === "number" ? `${returnOdometer.toLocaleString()} km` : "—"}
              </p>
            </div>
            <div>
              <p className={styles.summaryLabel}>Actual Return Date &amp; Time</p>
              <p className={styles.summaryValue}>{formatDateTime(postRent?.submittedAt)}</p>
            </div>
            <div>
              <p className={styles.summaryLabel}>Total Distance</p>
              <p className={styles.summaryValue}>{totalDistance !== null ? `${totalDistance.toLocaleString()} km` : "—"}</p>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Payment Summary</h2>
          <div className={styles.paymentRow}>
            <span>Total Rental Fee</span>
            <span>₱{totalRentalFee.toLocaleString()}.00</span>
          </div>
          <div className={styles.paymentRow}>
            <span>Add-ons</span>
            <span>₱{addonsTotal.toLocaleString()}.00</span>
          </div>
          <div className={styles.paymentRow}>
            <span>Discount</span>
            <span>-₱0.00</span>
          </div>
          <div className={styles.paymentRow}>
            <span>Overdue / Penalty</span>
            <span>₱0.00</span>
          </div>
          <div className={styles.paymentTotalRow}>
            <span>Total Amount</span>
            <span>₱{(booking.total ?? 0).toLocaleString()}.00</span>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Rental Timeline</h2>
          <div className={styles.timeline}>
            {timelineEvents.map((event, i) => (
              <div key={event.label} className={styles.timelineItem}>
                <span className={`${styles.timelineDot} ${i === timelineEvents.length - 1 ? styles.timelineDotActive : ""}`} />
                <div>
                  <p className={styles.timelineLabel}>{event.label}</p>
                  <p className={styles.timelineMeta}>
                    {formatDateTime(event.at)} • {event.by}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Documents Returned</h2>
          {/* TODO: UI-only placeholder — no per-booking "documents
              returned" field exists on any booking doc. Always renders as
              checked; not derived from real data. */}
          <div className={styles.docList}>
            {["Driver's License", "OR / CR", "Insurance", "Others"].map((label) => (
              <div key={label} className={styles.docItem}>
                <span className={styles.docCheck}>
                  <CheckIcon />
                </span>
                {label}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}