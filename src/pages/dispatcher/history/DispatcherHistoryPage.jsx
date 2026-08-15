import { useMemo, useState } from "react";
import DispatcherLayout from "../DispatcherLayout";
import HistoryTable from "../../../components/dispatcher/history/HistoryTable";
import Pagination from "../../../components/admin/common/Pagination";
import { useToast } from "../../../context/ToastContext";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import styles from "./DispatcherHistoryPage.module.css";

const PAGE_SIZE = 7;

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(d) {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(d) {
  if (!d) return "—";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Builds one history row per checklist submission (pickup and/or return)
// for every booking that has at least one dispatcher-submitted checklist.
function buildHistoryEntries(bookings) {
  const entries = [];

  bookings.forEach((b) => {
    const preRent = b.dispatchChecklist?.preRent;
    const postRent = b.dispatchChecklist?.postRent;

    if (preRent?.submittedAt) {
      const inspectedAt = toDate(preRent.submittedAt);
      entries.push({
        rowKey: `${b.id}-pickup`,
        id: b.id,
        customer: b.customer,
        vehicle: b.vehicle,
        plate: b.plate,
        pickupDate: b.pickupDateDisplay,
        pickupTime: b.pickupTime,
        returnDate: b.returnDateDisplay,
        returnTime: b.returnTime,
        inspectedOn: formatDate(inspectedAt),
        inspectedTime: formatTime(inspectedAt),
        status: "Cleared",
        sortAt: inspectedAt,
      });
    }

    if (postRent?.submittedAt) {
      const inspectedAt = toDate(postRent.submittedAt);
      entries.push({
        rowKey: `${b.id}-return`,
        id: b.id,
        customer: b.customer,
        vehicle: b.vehicle,
        plate: b.plate,
        pickupDate: b.pickupDateDisplay,
        pickupTime: b.pickupTime,
        returnDate: b.returnDateDisplay,
        returnTime: b.returnTime,
        inspectedOn: formatDate(inspectedAt),
        inspectedTime: formatTime(inspectedAt),
        status: "Returned",
        sortAt: inspectedAt,
      });
    }
  });

  return entries.sort(
    (a, b) => (b.sortAt?.getTime() || 0) - (a.sortAt?.getTime() || 0)
  );
}

export default function DispatcherHistoryPage() {
  const { bookings, loading } = useAdminBookings();
  const { showToast } = useToast();
  const [activeStatus, setActiveStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const allEntries = useMemo(() => buildHistoryEntries(bookings), [bookings]);

  const clearedCount = allEntries.filter((e) => e.status === "Cleared").length;
  const returnedCount = allEntries.filter(
    (e) => e.status === "Returned"
  ).length;

  const tabs = [
    { key: "All", label: `All (${allEntries.length})` },
    { key: "Cleared", label: `Cleared (${clearedCount})` },
    { key: "Returned", label: `Returned (${returnedCount})` },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEntries.filter((e) => {
      const matchesStatus = activeStatus === "All" || e.status === activeStatus;
      const matchesQuery =
        q === "" ||
        e.id.toLowerCase().includes(q) ||
        (e.customer || "").toLowerCase().includes(q) ||
        (e.vehicle || "").toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [allEntries, activeStatus, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
    showToast(`Viewing ${entry.id} isn't built yet — coming soon.`, {
      type: "info",
    });
  };

  return (
    <DispatcherLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Inspection History</h1>
        <p className={styles.subtitle}>
          View all inspected bookings and their status.
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabsRow}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`${styles.tab} ${
                activeStatus === tab.key ? styles.tabActive : ""
              }`}
              onClick={() => handleStatusChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M20 20l-3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search booking, customer, or car..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>

        <button type="button" className={styles.filterBtn}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6h16M7 12h10M10 18h4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span>Filter</span>
        </button>
      </div>

      {loading ? (
        <div className={styles.subtitle}>Loading inspection history…</div>
      ) : (
        <HistoryTable entries={pageItems} onViewDetails={handleViewDetails} />
      )}

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
