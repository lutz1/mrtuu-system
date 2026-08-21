import { useMemo, useState } from "react";
import ReportStatCard from "./ReportStatCard";
import ReportPagination from "./ReportPagination";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import styles from "./SalesReportTab.module.css";

const PAGE_SIZE = 5;

function RevenueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 20V10M10.5 20V4M17 20v-7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
function RentalIcon() {
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
function ChargesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="5"
        y="3.5"
        width="14"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.5 8h7M8.5 12h7M8.5 16h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BookingsIcon() {
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

const STAT_ICONS = {
  totalRevenue: <RevenueIcon />,
  rentalAmount: <RentalIcon />,
  otherCharges: <ChargesIcon />,
  totalBookings: <BookingsIcon />,
};

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

const currency = (n) =>
  `₱${(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

export default function SalesReportTab({ onViewBooking }) {
  const { bookings, loading } = useAdminBookings();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    return bookings.map((b) => {
      const rentalAmount = (b.dailyRate || 0) * (b.days || 1);
      const totalAmount = b.total || 0;
      const otherCharges = Math.max(0, totalAmount - rentalAmount);

      return {
        id: b.id,
        date:
          toDate(b.createdAt)?.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }) || "—",
        bookingId: `#${b.id}`,
        customer: b.customer || "—",
        vehicleName: b.vehicle || "—",
        vehiclePlate: b.plate || "—",
        rentalAmount,
        otherCharges,
        totalAmount,
        sortAt: toDate(b.createdAt)?.getTime() ?? 0,
      };
    });
  }, [bookings]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = rows;
    if (q) {
      list = rows.filter(
        (row) =>
          row.bookingId.toLowerCase().includes(q) ||
          row.customer.toLowerCase().includes(q) ||
          row.vehicleName.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => b.sortAt - a.sortAt);
  }, [rows, search]);

  const pagedRows = useMemo(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filteredRows, page]);

  const weekStart = daysAgo(6);
  const priorWeekStart = daysAgo(13);
  const priorWeekEnd = daysAgo(7);

  const thisWeek = rows.filter(
    (r) => r.sortAt && r.sortAt >= weekStart.getTime()
  );
  const priorWeek = rows.filter(
    (r) =>
      r.sortAt &&
      r.sortAt >= priorWeekStart.getTime() &&
      r.sortAt < priorWeekEnd.getTime()
  );

  const sum = (list, key) => list.reduce((total, r) => total + r[key], 0);

  const currentRevenue = sum(thisWeek, "totalAmount");
  const priorRevenue = sum(priorWeek, "totalAmount");
  const currentRental = sum(thisWeek, "rentalAmount");
  const priorRental = sum(priorWeek, "rentalAmount");
  const currentCharges = sum(thisWeek, "otherCharges");
  const priorCharges = sum(priorWeek, "otherCharges");

  const stats = [
    {
      key: "totalRevenue",
      label: "Total Revenue",
      value: currency(sum(rows, "totalAmount")),
      change: pctChange(currentRevenue, priorRevenue),
      direction: currentRevenue >= priorRevenue ? "up" : "down",
    },
    {
      key: "rentalAmount",
      label: "Rental Amount",
      value: currency(sum(rows, "rentalAmount")),
      change: pctChange(currentRental, priorRental),
      direction: currentRental >= priorRental ? "up" : "down",
    },
    {
      key: "otherCharges",
      label: "Other Charges",
      value: currency(sum(rows, "otherCharges")),
      change: pctChange(currentCharges, priorCharges),
      direction: currentCharges >= priorCharges ? "up" : "down",
    },
    {
      key: "totalBookings",
      label: "Total Bookings",
      value: String(rows.length),
      change: pctChange(thisWeek.length, priorWeek.length),
      direction: thisWeek.length >= priorWeek.length ? "up" : "down",
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
            comparisonLabel="vs prior 7 days"
          />
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Sales Summary</h2>
          <div className={styles.searchRow}>
            <div className={styles.searchBox}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by Booking ID, Customer, or Car..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <button type="button" className={styles.filterBtn}>
              Filter
            </button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Rental Amount</th>
                <th>Other Charges</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    Loading sales records...
                  </td>
                </tr>
              ) : pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    No matching records found.
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
                    <td>{currency(row.rentalAmount)}</td>
                    <td>{currency(row.otherCharges)}</td>
                    <td>{currency(row.totalAmount)}</td>
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
