import React, { useMemo, useState } from "react";
import AdminLayout from "../dashboard/AdminLayout";
import BookingFilterTabs from "../../../components/admin/booking/BookingFilterTabs";
import BookingSearchBar from "../../../components/admin/booking/BookingSearchBar";
import BookingsTable from "../../../components/admin/booking/BookingsTable";
import Pagination from "../../../components/admin/common/Pagination";
import { useToast } from "../../../context/ToastContext";
import { MOCK_BOOKINGS, BOOKING_STAGES } from "../../../data/admin/mockBookings";
import styles from "./AdminBookingsPage.module.css";

const PAGE_SIZE = 6;

export default function AdminBookingsPage() {
  const { showToast } = useToast();
  const [activeStage, setActiveStage] = useState(BOOKING_STAGES.QUEUE);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const queueCount = MOCK_BOOKINGS.filter((b) => b.stage === BOOKING_STAGES.QUEUE).length;
  const activeCount = MOCK_BOOKINGS.filter((b) => b.stage === BOOKING_STAGES.ACTIVE).length;

  const tabs = [
    { key: BOOKING_STAGES.QUEUE, label: `Booking Queue (${queueCount})` },
    { key: BOOKING_STAGES.ACTIVE, label: `Active Bookings (${activeCount})` },
    { key: BOOKING_STAGES.HISTORY, label: "Booking History" },
  ];

  const filteredBookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_BOOKINGS.filter((b) => {
      const matchesStage = b.stage === activeStage;
      const matchesQuery =
        q === "" ||
        b.id.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q) ||
        b.vehicle.toLowerCase().includes(q);
      return matchesStage && matchesQuery;
    });
  }, [activeStage, query]);

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

  // TODO: no booking-details view exists yet
  const handleView = (booking) => {
    showToast(`Viewing ${booking.id} isn't built yet — coming soon.`, { type: "info" });
  };

  // TODO: no new-booking flow exists yet
  const handleNewBooking = () => {
    showToast("New Booking isn't built yet — coming soon.", { type: "info" });
  };

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Bookings</h1>
      </div>

      <div className={styles.toolbar}>
        <BookingFilterTabs tabs={tabs} active={activeStage} onChange={handleStageChange} />
        <button type="button" className={styles.newBookingBtn} onClick={handleNewBooking}>
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