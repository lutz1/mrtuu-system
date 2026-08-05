import React, { useMemo, useState } from "react";
import DispatcherLayout from "../DispatcherLayout";
import InspectionQueueTable from "../../../components/dispatcher/inspection/InspectionQueueTable";
import Pagination from "../../../components/admin/common/Pagination";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import { useToast } from "../../../context/ToastContext";
import { BOOKING_STAGES } from "../../../data/admin/mockBookings";
import styles from "./DispatcherInspectionPage.module.css";

const PAGE_SIZE = 6;

export default function DispatcherInspectionPage() {
  const { bookings } = useAdminBookings();
  const { showToast } = useToast();
  const [activeQueue, setActiveQueue] = useState("pickup");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const pickupBookings = useMemo(() => bookings.filter((b) => b.stage === BOOKING_STAGES.QUEUE), [bookings]);
  const returnBookings = useMemo(() => bookings.filter((b) => b.stage === BOOKING_STAGES.ACTIVE), [bookings]);
  const currentList = activeQueue === "pickup" ? pickupBookings : returnBookings;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === "") return currentList;
    return currentList.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q) ||
        b.vehicle.toLowerCase().includes(q)
    );
  }, [currentList, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleQueueChange = (queue) => {
    setActiveQueue(queue);
    setQuery("");
    setPage(1);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(1);
  };

  // TODO: no inspection checklist screen exists yet
  const handleStartInspection = (booking) => {
    showToast(`Inspection for ${booking.id} isn't built yet — coming soon.`, { type: "info" });
  };

  return (
    <DispatcherLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Vehicle Inspection</h1>
      </div>

      <div className={styles.tabsRow}>
        <button
          type="button"
          className={`${styles.tab} ${activeQueue === "pickup" ? styles.tabActive : ""}`}
          onClick={() => handleQueueChange("pickup")}
        >
          Pickup Queue ({pickupBookings.length})
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeQueue === "return" ? styles.tabActive : ""}`}
          onClick={() => handleQueueChange("return")}
        >
          Return Queue ({returnBookings.length})
        </button>
      </div>

      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search booking, customer, or car..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>

        {/* TODO: wire to a real filter panel once filter criteria are defined */}
        <button type="button" className={styles.filterBtn}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Filter
        </button>
      </div>

      <div className={styles.noticeBar}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 11v5.5M12 8v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {activeQueue === "pickup"
          ? "Complete the inspection before releasing the vehicle to the customer"
          : "Inspect the vehicle for damage and mileage before closing out the booking"}
      </div>

      <InspectionQueueTable bookings={pageItems} onStartInspection={handleStartInspection} />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="entries"
      />
    </DispatcherLayout>
  );
}