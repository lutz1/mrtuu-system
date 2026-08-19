import { useMemo, useState } from "react";
import ReportStatCard from "./ReportStatCard";
import ReportPagination from "./ReportPagination";
import {
  CUSTOMER_REPORT_ROWS,
  CUSTOMER_REPORT_STATS,
  CUSTOMER_BOOKING_STATUS,
  CUSTOMER_BOOKING_TOTAL,
  PAGE_SIZE,
} from "./mockReportsData";
import styles from "./CustomerReportTab.module.css";

function TotalCustomersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.5" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 19c1-3.6 3.1-5.3 5.5-5.3s4.5 1.7 5.5 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 14.3c2 .3 3.5 1.9 4.3 4.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function NewCustomerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 19c1-3.6 3.2-5.3 5.5-5.3s4.5 1.7 5.5 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17.5 8v5M15 10.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function RepeatCustomerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 19c1-3.6 3.2-5.3 5.5-5.3s4.5 1.7 5.5 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.5 12l1.4 1.4 2.6-2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
  totalCustomers: <TotalCustomersIcon />,
  newCustomers: <NewCustomerIcon />,
  repeatCustomers: <RepeatCustomerIcon />,
};

const STATUS_OPTIONS = ["All Status", "Active", "Inactive"];
const TYPE_OPTIONS = ["All Customer Type", "Regular", "New"];

function BookingStatusDonut({ segments, total }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const sumValues = segments.reduce((sum, s) => sum + s.value, 0);
  let offsetAcc = 0;

  return (
    <svg viewBox="0 0 100 100" className={styles.donutSvg}>
      <g transform="rotate(-90 50 50)">
        {segments.map((seg) => {
          const fraction = sumValues === 0 ? 0 : seg.value / sumValues;
          const dash = fraction * circumference;
          const circle = (
            <circle
              key={seg.label}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offsetAcc}
            />
          );
          offsetAcc += dash;
          return circle;
        })}
      </g>
      <text x="50" y="55" textAnchor="middle" className={styles.donutTotal}>
        {total}
      </text>
    </svg>
  );
}

export default function CustomerReportTab({ onViewCustomer }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Customer Type");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CUSTOMER_REPORT_ROWS.filter((row) => {
      const matchesSearch =
        !q ||
        row.customer.toLowerCase().includes(q) ||
        row.contact.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q);
      const matchesType = typeFilter === "All Customer Type" || row.customerType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

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
        {CUSTOMER_REPORT_STATS.map((stat) => (
          <ReportStatCard
            key={stat.key}
            icon={STAT_ICONS[stat.key]}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.filtersRow}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by Customer Name, Phone, Email...."
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
            value={typeFilter}
            onChange={(e) => resetToFirstPage(setTypeFilter)(e.target.value)}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <button type="button" className={styles.filterBtn}>
            Filter
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Total Bookings</th>
                <th>Last Booking</th>
                <th>Customer Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    No matching customers found.
                  </td>
                </tr>
              ) : (
                pagedRows.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.idCell}>{row.customerId}</td>
                    <td className={styles.nameCell}>{row.customer}</td>
                    <td>{row.contact}</td>
                    <td>{row.email}</td>
                    <td>{row.totalBookings}</td>
                    <td>{row.lastBooking}</td>
                    <td>{row.customerType}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => onViewCustomer?.(row)}
                        aria-label={`View ${row.customer}`}
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

      <div className={styles.card}>
        <h3 className={styles.widgetTitle}>Booking by Status</h3>
        <div className={styles.donutRow}>
          <BookingStatusDonut segments={CUSTOMER_BOOKING_STATUS} total={CUSTOMER_BOOKING_TOTAL} />
          <div className={styles.statusBlocks}>
            {CUSTOMER_BOOKING_STATUS.map((seg) => (
              <div key={seg.label} className={styles.statusBlock}>
                <span className={styles.statusLabelRow}>
                  <span className={styles.legendDot} style={{ background: seg.color }} />
                  {seg.label}
                </span>
                <span className={styles.statusValue}>{seg.value}</span>
                <span className={styles.statusPercent}>({seg.percent})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}