import React, { useMemo, useState } from "react";
import DispatcherLayout from "../DispatcherLayout";
import HistoryTable from "../../../components/dispatcher/history/HistoryTable";
import Pagination from "../../../components/admin/common/Pagination";
import { useToast } from "../../../context/ToastContext";
import { MOCK_INSPECTION_HISTORY } from "../../../data/dispatcher/mockInspectionHistory";
import styles from "./DispatcherHistoryPage.module.css";

const PAGE_SIZE = 7;

export default function DispatcherHistoryPage() {
  const { showToast } = useToast();
  const [activeStatus, setActiveStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const clearedCount = MOCK_INSPECTION_HISTORY.filter((e) => e.status === "Cleared").length;
  const sentCount = MOCK_INSPECTION_HISTORY.filter((e) => e.status === "Sent to Admin").length;
  const returnedCount = MOCK_INSPECTION_HISTORY.filter((e) => e.status === "Returned").length;

  const tabs = [
    { key: "All", label: `All (${MOCK_INSPECTION_HISTORY.length})` },
    { key: "Cleared", label: `Cleared (${clearedCount})` },
    { key: "Sent to Admin", label: `Sent to Admin (${sentCount})` },
    { key: "Returned", label: `Returned (${returnedCount})` },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_INSPECTION_HISTORY.filter((e) => {
      const matchesStatus = activeStatus === "All" || e.status === activeStatus;
      const matchesQuery =
        q === "" ||
        e.id.toLowerCase().includes(q) ||
        e.customer.toLowerCase().includes(q) ||
        e.vehicle.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [activeStatus, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setQuery("");
    setPage(1);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(1);
  };

  // TODO: no inspection-details view exists yet
  const handleViewDetails = (entry) => {
    showToast(`Viewing ${entry.id} isn't built yet — coming soon.`, { type: "info" });
  };

  return (
    <DispatcherLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Inspection History</h1>
        <p className={styles.subtitle}>View all inspected bookings and their status.</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabsRow}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`${styles.tab} ${activeStatus === tab.key ? styles.tabActive : ""}`}
              onClick={() => handleStatusChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
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

      <HistoryTable entries={pageItems} onViewDetails={handleViewDetails} />

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