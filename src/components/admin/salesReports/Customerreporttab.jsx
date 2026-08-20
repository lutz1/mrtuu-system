import { useMemo, useState } from "react";
import ReportStatCard from "./ReportStatCard";
import ReportPagination from "./ReportPagination";
import { useCustomers } from "../../../context/CustomersContext";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import styles from "./CustomerReportTab.module.css";

const PAGE_SIZE = 5;

function TotalCustomersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <circle
        cx="16.5"
        cy="9.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.5 19c1-3.6 3.1-5.3 5.5-5.3s4.5 1.7 5.5 5.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15 14.3c2 .3 3.5 1.9 4.3 4.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function NewCustomerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.5 19c1-3.6 3.2-5.3 5.5-5.3s4.5 1.7 5.5 5.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M17.5 8v5M15 10.5h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function RepeatCustomerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.5 19c1-3.6 3.2-5.3 5.5-5.3s4.5 1.7 5.5 5.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15.5 12l1.4 1.4 2.6-2.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
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

const STAT_ICONS = {
  totalCustomers: <TotalCustomersIcon />,
  newCustomers: <NewCustomerIcon />,
  repeatCustomers: <RepeatCustomerIcon />,
};

const COLORS = {
  Completed: "#6C8CF5",
  Active: "#33C481",
  Cancelled: "#F2A93B",
};

const TYPE_OPTIONS = ["All Customer Type", "Regular", "New"];

function BookingStatusDonut({ segments, total }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;
  return (
    <svg viewBox="0 0 100 100" className={styles.donutSvg}>
      <g transform="rotate(-90 50 50)">
        {segments.map((seg) => {
          const fraction = total === 0 ? 0 : seg.value / total;
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
  const { customers, loading } = useCustomers();
  const { bookings } = useAdminBookings();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Customer Type");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    return customers.map((c) => {
      const customerBookings = bookings.filter((b) => b.uid === c.uid);
      const lastBookingAt = customerBookings
        .map((b) => toDate(b.createdAt))
        .filter(Boolean)
        .sort((a, b) => b.getTime() - a.getTime())[0];
      return {
        id: c.id,
        customerId: c.id,
        customer: c.name,
        contact: c.phone,
        email: c.email,
        totalBookings: customerBookings.length,
        lastBooking: formatDate(lastBookingAt),
        customerType: customerBookings.length > 1 ? "Regular" : "New",
      };
    });
  }, [customers, bookings]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !q ||
        (row.customer || "").toLowerCase().includes(q) ||
        (row.contact || "").toLowerCase().includes(q) ||
        (row.email || "").toLowerCase().includes(q);
      const matchesType =
        typeFilter === "All Customer Type" || row.customerType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [rows, search, typeFilter]);

  const pagedRows = useMemo(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filteredRows, page]);

  const resetToFirstPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const now = new Date();
  const newThisMonth = customers.filter((c) => {
    const d = toDate(c.joinedAt);
    return (
      d &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;
  const repeatCount = rows.filter((r) => r.customerType === "Regular").length;

  const stats = [
    {
      key: "totalCustomers",
      label: "Total Customers",
      value: String(customers.length),
    },
    {
      key: "newCustomers",
      label: "New This Month",
      value: String(newThisMonth),
    },
    {
      key: "repeatCustomers",
      label: "Repeat Customers",
      value: String(repeatCount),
    },
  ];

  const statusCounts = bookings.reduce((acc, b) => {
    const label =
      b.status === "completed"
        ? "Completed"
        : b.status === "cancelled"
        ? "Cancelled"
        : "Active";
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  const total = bookings.length || 1;

  const bookingStatus = ["Completed", "Active", "Cancelled"]
    .map((label) => ({
      label,
      value: statusCounts[label] || 0,
      percent: `${(((statusCounts[label] || 0) / total) * 100).toFixed(1)}%`,
      color: COLORS[label],
    }))
    .filter((s) => s.value > 0);

  return (
    <>
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
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
            value={typeFilter}
            onChange={(e) => resetToFirstPage(setTypeFilter)(e.target.value)}
          >
            {TYPE_OPTIONS.map((opt) => (
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
              {loading ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    Loading customers...
                  </td>
                </tr>
              ) : pagedRows.length === 0 ? (
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
          <BookingStatusDonut
            segments={bookingStatus}
            total={bookings.length}
          />
          <div className={styles.statusBlocks}>
            {bookingStatus.map((seg) => (
              <div key={seg.label} className={styles.statusBlock}>
                <span className={styles.statusLabelRow}>
                  <span
                    className={styles.legendDot}
                    style={{ background: seg.color }}
                  />
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
