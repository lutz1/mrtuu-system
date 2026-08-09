import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../dashboard/AdminLayout";
import BookingFilterTabs from "../../../components/admin/booking/BookingFilterTabs";
import BookingSearchBar from "../../../components/admin/booking/BookingSearchBar";
import BookingsTable from "../../../components/admin/booking/BookingsTable";
import Pagination from "../../../components/admin/common/Pagination";
import { useToast } from "../../../context/ToastContext";
import {
  useAdminBookings,
  BOOKING_STAGES,
} from "../../../context/AdminBookingsContext";
import { useStaff } from "../../../context/StaffContext";
// NOTE: onView is repurposed as the clearance action below (MVP) — the
// BookingsTable "eye" icon now clears/rejects instead of just viewing.
import styles from "./AdminBookingsPage.module.css";

const PAGE_SIZE = 6;

export default function AdminBookingsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { bookings, submitClearance } = useAdminBookings();
  const { staffProfile } = useStaff();
  const [activeStage, setActiveStage] = useState(BOOKING_STAGES.QUEUE);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const queueCount = bookings.filter(
    (b) => b.stage === BOOKING_STAGES.QUEUE
  ).length;
  const activeCount = bookings.filter(
    (b) => b.stage === BOOKING_STAGES.ACTIVE
  ).length;

  const tabs = [
    { key: BOOKING_STAGES.QUEUE, label: `Booking Queue (${queueCount})` },
    { key: BOOKING_STAGES.ACTIVE, label: `Active Bookings (${activeCount})` },
    { key: BOOKING_STAGES.HISTORY, label: "Booking History" },
  ];

  const filteredBookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesStage = b.stage === activeStage;
      const matchesQuery =
        q === "" ||
        b.id.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q) ||
        b.vehicle.toLowerCase().includes(q);
      return matchesStage && matchesQuery;
    });
  }, [bookings, activeStage, query]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleStageChange = (stage) => {
    setActiveStage(stage);
    setQuery("");
    setPage(1);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(1);
  };

  // MVP clearance action (docs + license check) until a dedicated clearance
  // review page/modal exists — a real UI should replace this window.confirm
  // with a form collecting licenseVerified / notes / rejectionReason.
  const handleView = async (booking) => {
    if (booking.clearance?.status === "cleared") {
      showToast(
        `${booking.id} is already cleared — waiting for dispatcher pickup.`,
        { type: "info" }
      );
      return;
    }
    if (booking.status !== "confirmed") {
      showToast(`${booking.id} isn't awaiting clearance right now.`, {
        type: "info",
      });
      return;
    }

    const approve = window.confirm(
      `Clear ${booking.id} for ${booking.customer}?\n\nOK = Cleared (documents verified)\nCancel = Reject`
    );

    try {
      await submitClearance(booking.id, {
        staffUid: staffProfile?.uid,
        approve,
        licenseVerified: approve,
        notes: "",
        rejectionReason: approve ? null : "Documents not verified",
      });
      showToast(
        approve
          ? `${booking.id} cleared — sent to dispatcher.`
          : `${booking.id} rejected.`,
        { type: approve ? "success" : "error" }
      );
    } catch (err) {
      console.error("Failed to submit clearance:", err);
      showToast("Failed to update clearance. Please try again.", {
        type: "error",
      });
    }
  };

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Bookings</h1>
      </div>

      <div className={styles.toolbar}>
        <BookingFilterTabs
          tabs={tabs}
          active={activeStage}
          onChange={handleStageChange}
        />
        <button
          type="button"
          className={styles.newBookingBtn}
          onClick={() => navigate("/admin/bookings/new")}
        >
          <span className={styles.newBookingIcon}>+</span>
          New Booking
        </button>
      </div>

      <div className={styles.searchWrap}>
        <BookingSearchBar value={query} onChange={handleQueryChange} />
      </div>

      <BookingsTable bookings={pageItems} onView={handleView} />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filteredBookings.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="bookings"
      />
    </AdminLayout>
  );
}
