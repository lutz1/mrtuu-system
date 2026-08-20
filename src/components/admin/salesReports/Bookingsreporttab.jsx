import { useMemo, useState } from "react";
import ReportStatCard from "./ReportStatCard";
import ReportPagination from "./ReportPagination";
import StatusBadge from "./StatusBadge";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import styles from "./BookingsReportTab.module.css";

const PAGE_SIZE = 5;

function TotalBookingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.5 3.5v17l5.5-3 5.5 3v-17z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ActiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 15l1.5-5A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="3"
        y="15"
        width="18"
        height="4"
        rx="1.3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function CompletedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="4.5"
        y="3.5"
        width="15"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.5 12l2.3 2.3L15.5 9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CancelledIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="4.5"
        y="3.5"
        width="15"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9.5 9.5l5 5m0-5l-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M20 20l-4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}
function pctChange(current, prior) {
  if (!prior) return current > 0 ? "+100%" : "0%";
  const pct = ((current - prior) / prior) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

// real status -> report status
function toReportStatus(status) {
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return "Active"; // pending, confirmed, ongoing
}

const STAT_ICONS = {
  totalBookings: <TotalBookingsIcon />,
  activeRentals: <ActiveIcon />,
  completedRentals: <CompletedIcon />,
  cancelledBookings: <CancelledIcon />,
};

const STATUS_OPTIONS = ["All Status", "Active", "Completed", "Cancelled"];

export default function BookingsReportTab({ onViewBooking }) {
  const { bookings, loading } = useAdminBookings();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    return bookings.map((b) => ({
      id: b.id,
      date:
        toDate(b.createdAt)?.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }) || "—",
      bookingId: `#${b.id}`,
      customer: b.customer,
      vehicleName: b.vehicle,
      vehiclePlate: b.plate,
      rentTime: `${b.days ?? 1} day(s)`,
      totalAmount: b.total || 0,
      status: toReportStatus(b.status),
      sortAt: toDate(b.createdAt)?.getTime() ?? 0,
    }));
  }, [bookings]);

  const vehicleOptions = useMemo(() => {
    const names = new Set(rows.map((r) => r.vehicleName).filter(Boolean));
    return ["All Vehicles", ...Array.from(names)];
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((row) => {
        const matchesSearch =
          !q ||
          row.id.toLowerCase().includes(q) ||
          (row.customer || "").toLowerCase().includes(q) ||
          (row.vehicleName || "").toLowerCase().includes(q);
        const matchesStatus =
          statusFilter === "All Status" || row.status === statusFilter;
        const matchesVehicle =
          vehicleFilter === "All Vehicles" || row.vehicleName === vehicleFilter;
        return matchesSearch && matchesStatus && matchesVehicle;
      })
      .sort((a, b) => b.sortAt - a.sortAt);
  }, [rows, search, statusFilter, vehicleFilter]);

  const pagedRows = useMemo(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filteredRows, page]);

  const resetToFirstPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const weekStart = daysAgo(6);
  const priorWeekStart = daysAgo(13);
  const priorWeekEnd = daysAgo(7);
  const inRange = (b, start, end) => {
    const d = toDate(b.createdAt);
    return d && d >= start && (!end || d < end);
  };

  const thisWeek = bookings.filter((b) => inRange(b, weekStart));
  const priorWeek = bookings.filter((b) =>
    inRange(b, priorWeekStart, priorWeekEnd)
  );

  const countBy = (list, pred) => list.filter(pred).length;
  const activeCount = countBy(
    bookings,
    (b) => !["completed", "cancelled"].includes(b.status)
  );
  const completedCount = countBy(bookings, (b) => b.status === "completed");
  const cancelledCount = countBy(bookings, (b) => b.status === "cancelled");

  const stats = [
    {
      key: "totalBookings",
      label: "Total Bookings",
      value: String(bookings.length),
      change: pctChange(thisWeek.length, priorWeek.length),
      direction: thisWeek.length >= priorWeek.length ? "up" : "down",
    },
    {
      key: "activeRentals",
      label: "Active Rentals",
      value: String(activeCount),
      change: pctChange(
        countBy(
          thisWeek,
          (b) => !["completed", "cancelled"].includes(b.status)
        ),
        countBy(
          priorWeek,
          (b) => !["completed", "cancelled"].includes(b.status)
        )
      ),
      direction: "up",
    },
    {
      key: "completedRentals",
      label: "Completed Rentals",
      value: String(completedCount),
      change: pctChange(
        countBy(thisWeek, (b) => b.status === "completed"),
        countBy(priorWeek, (b) => b.status === "completed")
      ),
      direction: "up",
    },
    {
      key: "cancelledBookings",
      label: "Cancelled Bookings",
      value: String(cancelledCount),
      change: pctChange(
        countBy(thisWeek, (b) => b.status === "cancelled"),
        countBy(priorWeek, (b) => b.status === "cancelled")
      ),
      direction: "down",
    },
  ];

  return (
    <>
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <ReportStatCard
            key={stat.key}
            icon={STAT_ICONS[stat.key]}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            direction={stat.direction}
            comparisonLabel="vs last 7 days"
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
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Duration</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    Loading bookings...
                  </td>
                </tr>
              ) : pagedRows.length === 0 ? (
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
                        <span className={styles.vehicleName}>
                          {row.vehicleName}
                        </span>
                        <span className={styles.vehiclePlate}>
                          {row.vehiclePlate}
                        </span>
                      </div>
                    </td>
                    <td>{row.rentTime}</td>
                    <td>
                      ₱
                      {row.totalAmount.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
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

      <p className={styles.footerNote}>
        All amounts are in Philippine Peso (PHP)
      </p>
    </>
  );
}
