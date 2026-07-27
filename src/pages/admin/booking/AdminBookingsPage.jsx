import React, { useMemo, useState } from "react";
import AdminLayout from "../dashboard/AdminLayout";
import BookingFilterTabs from "../../../components/admin/booking/BookingFilterTabs";
import BookingSearchBar from "../../../components/admin/booking/BookingSearchBar";
import BookingsTable from "../../../components/admin/booking/BookingsTable";
import Pagination from "../../../components/admin/common/Pagination";
import { MOCK_BOOKINGS } from "../../../data/admin/mockBookings";
import styles from "./AdminBookingsPage.module.css";

const PAGE_SIZE = 6;

export default function AdminBookingsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredBookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_BOOKINGS.filter((b) => {
      const matchesTab = activeTab === "All" || b.status === activeTab;
      const matchesQuery =
        q === "" ||
        b.id.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q) ||
        b.vehicle.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [activeTab, query]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredBookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Bookings</h1>
      </div>

      <div className={styles.toolbar}>
        <BookingFilterTabs active={activeTab} onChange={handleTabChange} />
        <BookingSearchBar value={query} onChange={handleQueryChange} />
      </div>

      <BookingsTable bookings={pageItems} />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filteredBookings.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </AdminLayout>
  );
}