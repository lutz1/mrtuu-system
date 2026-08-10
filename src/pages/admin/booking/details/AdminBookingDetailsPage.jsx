import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../dashboard/AdminLayout";
import BookingSummaryCards from "../../../../components/admin/booking/details/BookingSummaryCards";
import { useAdminBookings } from "../../../../context/AdminBookingsContext";
import { useStaff } from "../../../../context/StaffContext";
import { useToast } from "../../../../context/ToastContext";
import styles from "./AdminBookingDetailsPage.module.css";

const CHECKLIST_ITEMS = [
  { key: "license", label: "Driver's License" },
  { key: "validId", label: "Valid ID" },
  { key: "proofOfPayment", label: "Proof of Payment" },
];

export default function AdminBookingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookingById, submitClearance } = useAdminBookings();
  const { staffProfile } = useStaff();
  const { showToast } = useToast();

  const booking = getBookingById(id);
  const [checked, setChecked] = useState({});
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) {
    return (
      <AdminLayout>
        <div className={styles.pageHeading}>
          <h1 className={styles.title}>Booking not found</h1>
          <p className={styles.subtitle}>
            This booking may have been removed, or hasn't finished loading yet.
          </p>
        </div>
      </AdminLayout>
    );
  }

  // Walk-in bookings are automatically cleared at creation.
  // Online bookings require manual "Send to Dispatcher" action unless clearance status is already cleared/approved.
  const isWalkIn = booking.source === "Walk-in";
  const isCleared =
    isWalkIn ||
    booking.clearance?.status === "cleared" ||
    booking.clearance?.status === "approved";

  const toggleChecked = (key) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendToDispatcher = async () => {
    setIsSubmitting(true);
    try {
      await submitClearance(booking.id, {
        staffUid: staffProfile?.uid,
        approve: true,
        licenseVerified: true,
        notes: remarks,
        rejectionReason: null,
      });
      showToast(`Booking ${booking.id} cleared — sent to dispatcher.`, {
        type: "success",
      });
      navigate("/admin/bookings");
    } catch (err) {
      console.error("Failed to submit clearance:", err);
      showToast("Failed to clear this booking. Please try again.", {
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <Link to="/admin/bookings" className={styles.backLink}>
        Back to Queue
      </Link>

      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Booking {booking.id}</h1>
        <p className={styles.subtitle}>{booking.source} booking</p>
      </div>

      <BookingSummaryCards booking={booking} />

      {isCleared ? (
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Clearance Status</h2>
          <p className={styles.clearedText}>
            {isWalkIn
              ? "Walk-in booking verified in person. Ready for dispatcher inspection and pickup."
              : "This booking is cleared and waiting for the dispatcher to process pickup."}
          </p>
          {booking.clearance?.notes && (
            <p className={styles.remarksReadout}>
              Notes: {booking.clearance.notes}
            </p>
          )}
        </section>
      ) : (
        /* Only Online bookings that are NOT cleared yet reach this UI */
        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Required Documents</h2>
            <p className={styles.cardSubtitle}>
              Review uploaded documents before sending to dispatcher.
            </p>

            <div className={styles.checklist}>
              {CHECKLIST_ITEMS.map((item) => (
                <label key={item.key} className={styles.checklistRow}>
                  <input
                    type="checkbox"
                    checked={!!checked[item.key]}
                    onChange={() => toggleChecked(item.key)}
                  />
                  {item.label}
                </label>
              ))}
            </div>

            <textarea
              className={styles.remarksInput}
              placeholder="Add remarks about this booking (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              maxLength={500}
            />
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Booking Actions</h2>
            <p className={styles.cardSubtitle}>
              Approve this online booking to send it to the dispatcher for vehicle pickup.
            </p>
            <button
              type="button"
              className={styles.sendBtn}
              onClick={handleSendToDispatcher}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send to Dispatcher"}
            </button>
          </section>
        </div>
      )}
    </AdminLayout>
  );
}