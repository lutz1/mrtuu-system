import { useMemo, useState } from "react";
import ReportStatCard from "./ReportStatCard";
import ReportPagination from "./ReportPagination";
import StatusBadge from "./StatusBadge";
import { BOOKINGS_REPORT_ROWS, BOOKINGS_REPORT_STATS, PAGE_SIZE } from "./mockReportsData";
import styles from "./BookingsReportTab.module.css";

function TotalBookingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 3.5v17l5.5-3 5.5 3v-17z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function ActiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 15l1.5-5A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="15" width="18" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function CompletedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 12l2.3 2.3L15.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CancelledIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.5 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const STAT_ICONS = {
  totalBookings: <TotalBookingsIcon />,
  activeRentals: <ActiveIcon />,
  completedRentals: <CompletedIcon />,
  cancelledBookings: <CancelledIcon />,
};

const STATUS_OPTIONS = ["All Status", "Active", "Completed", "Cancelled"];

export default function BookingsReportTab({ onViewBooking }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [page, setPage] = useState(1);

  const vehicleOptions = useMemo(() => {
    const names = new Set(BOOKINGS_REPORT_ROWS.map((r) => r.vehicleName));
    return ["All Vehicles", ...Array.from(names)];
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return BOOKINGS_REPORT_ROWS.filter((row) => {
      const matchesSearch =
        !q ||
        row.bookingId.toLowerCase().includes(q) ||
        row.customer.toLowerCase().includes(q) ||
        row.vehicleName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All Status" || row.status === statusFilter;
      const matchesVehicle = vehicleFilter === "All Vehicles" || row.vehicleName === vehicleFilter;
      return matchesSearch && matchesStatus && matchesVehicle;
    });
  }, [search, statusFilter, vehicleFilter]);

  const pagedRows = useMemo(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filteredRows, page]);

  const resetToFirstPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <>
      <div className={styles.statsGrid}>
        {BOOKINGS_REPORT_STATS.map((stat) => (
          <ReportStatCard
            key={stat.key}
            icon={STAT_ICONS[stat.key]}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            direction={stat.direction}
            comparisonLabel="vs July 13 - July 19, 2026"
          />
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.filtersRow}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by Booking ID, Customer, or Car..."
              value={search}
              onChange={(e) => resetToFirstPage(setSearch)(e.target.value)}
            />
          </div>

          <select
            className={styles.select}
            value={statusFilter}
            onChange={(e) => resetToFirstPage(setStatusFilter)(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={vehicleFilter}
            onChange={(e) => resetToFirstPage(setVehicleFilter)(e.target.value)}
          >
            {vehicleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <select className={styles.select} defaultValue="Date Range">
            <option value="Date Range" disabled>
              Date Range
            </option>
          </select>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Rent Time</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    No matching bookings found.
                  </td>
                </tr>
              ) : (
                pagedRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td>{row.bookingId}</td>
                    <td>{row.customer}</td>
                    <td>
                      <div className={styles.vehicleCell}>
                        <span className={styles.vehicleName}>{row.vehicleName}</span>
                        <span className={styles.vehiclePlate}>{row.vehiclePlate}</span>
                      </div>
                    </td>
                    <td>{row.rentTime}</td>
                    <td>₱{row.totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => onViewBooking?.(row)}
                        aria-label={`View ${row.bookingId}`}
                      >
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ReportPagination
          page={page}
          pageSize={PAGE_SIZE}
          totalItems={filteredRows.length}
          onPageChange={setPage}
        />
      </div>

      <p className={styles.footerNote}>All amounts are in Philippine Peso (PHP)</p>
    </>
  );
}