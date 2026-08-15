import { useNavigate } from "react-router-dom";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import { useMemo } from "react";
import styles from "./ChecklistReviewTable.module.css";

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(value) {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Booking-time documents are driver's license + valid ID (2 total).
// Once clearance is "cleared", treat it as complete regardless of count.
function getDocStatus(booking) {
  if (booking.clearance?.status === "cleared") return "Complete";

  const required = [
    booking.driver?.driversLicenseUrl || booking.documents?.driversLicenseUrl,
    booking.driver?.validIdUrl || booking.documents?.validIdUrl,
  ];
  const uploaded = required.filter(Boolean).length;
  return `${uploaded}/${required.length} Uploaded`;
}

export default function ChecklistReviewTable() {
  const navigate = useNavigate();
  const { bookings, loading } = useAdminBookings();

  const pendingRows = useMemo(() => {
    return bookings
      .filter(
        (b) =>
          b.status !== "cancelled" &&
          b.status !== "completed" &&
          b.clearance?.status !== "cleared" &&
          b.clearance?.status !== "rejected"
      )
      .sort(
        (a, b) =>
          (toDate(b.createdAt)?.getTime() ?? Infinity) -
          (toDate(a.createdAt)?.getTime() ?? Infinity)
      )
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        customer: b.customer,
        vehicle: b.vehicle,
        docStatus: getDocStatus(b),
        date: formatDate(b.createdAt),
      }));
  }, [bookings]);

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Checklist to Review</h2>
        <button
          type="button"
          className={styles.viewAllBtn}
          onClick={() => navigate("/admin/bookings")}
        >
          View All
        </button>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <p>Loading checklist...</p>
        ) : pendingRows.length === 0 ? (
          <p>No bookings waiting for clearance review.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Document Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.customer}</td>
                  <td>{row.vehicle}</td>
                  <td
                    className={
                      row.docStatus === "Complete"
                        ? styles.docComplete
                        : undefined
                    }
                  >
                    {row.docStatus}
                  </td>
                  <td>{row.date}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.reviewBtn}
                      onClick={() => navigate(`/admin/bookings/${row.id}`)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
