import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../dashboard/AdminLayout";
import BookingFilterTabs from "../../../components/admin/booking/BookingFilterTabs";
import BookingSearchBar from "../../../components/admin/booking/BookingSearchBar";
import BookingsTable from "../../../components/admin/booking/BookingsTable";
import BookingHistoryStats from "../../../components/admin/booking/history/BookingHistoryStats";
import BookingHistoryTable from "../../../components/admin/booking/history/BookingHistoryTable";
import Pagination from "../../../components/admin/common/Pagination";
import ActiveBookingModal from "../../../components/admin/booking/active/ActiveBookingModal";
import { useAdminBookings, BOOKING_STAGES } from "../../../context/AdminBookingsContext";
import styles from "./AdminBookingsPage.module.css";

const PAGE_SIZE = 6;

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate(); // Firestore Timestamp
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function AdminBookingsPage() {
  const navigate = useNavigate();
  const { bookings } = useAdminBookings();
  const [activeStage, setActiveStage] = useState(BOOKING_STAGES.QUEUE);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [activeBookingModal, setActiveBookingModal] = useState(null);

  const queueCount = bookings.filter((b) => b.stage === BOOKING_STAGES.QUEUE).length;
  const activeCount = bookings.filter((b) => b.stage === BOOKING_STAGES.ACTIVE).length;
  const historyBookings = useMemo(() => bookings.filter((b) => b.stage === BOOKING_STAGES.HISTORY), [bookings]);

  const now = new Date();
  const thisMonthCount = historyBookings.filter((b) => {
    const d = toDate(b.returnedAt) || toDate(b.createdAt);
    return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

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

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredBookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleStageChange = (stage) => {
    setActiveStage(stage);
    setQuery("");
    setPage(1);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(1);
  };

  const handleView = (booking) => {
    if (booking.stage === BOOKING_STAGES.ACTIVE) {
      setActiveBookingModal(booking);
      return;
    }
    navigate(`/admin/bookings/${booking.id}`);
  };

  const handleViewHistoryDetails = (booking) => {
    navigate(`/admin/bookings/history/${booking.id}`);
  };

  const isHistory = activeStage === BOOKING_STAGES.HISTORY;

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Bookings</h1>
      </div>

      <div className={styles.toolbar}>
        <BookingFilterTabs tabs={tabs} active={activeStage} onChange={handleStageChange} />
        <button type="button" className={styles.newBookingBtn} onClick={() => navigate("/admin/bookings/new")}>
          <span className={styles.newBookingIcon}>+</span>
          New Booking
        </button>
      </div>

      <div className={styles.searchWrap}>
        <BookingSearchBar value={query} onChange={handleQueryChange} />
      </div>

      {isHistory && <BookingHistoryStats total={historyBookings.length} thisMonth={thisMonthCount} />}

      {isHistory ? (
        <BookingHistoryTable bookings={pageItems} onViewDetails={handleViewHistoryDetails} />
      ) : (
        <BookingsTable bookings={pageItems} onView={handleView} />
      )}

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filteredBookings.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="bookings"
      />

      {activeBookingModal && (
        <ActiveBookingModal booking={activeBookingModal} onClose={() => setActiveBookingModal(null)} />
      )}
    </AdminLayout>
  );
}