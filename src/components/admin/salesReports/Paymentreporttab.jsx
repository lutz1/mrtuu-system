import { useMemo, useState } from "react";
import ReportStatCard from "./ReportStatCard";
import ReportPagination from "./ReportPagination";
import StatusBadge from "./StatusBadge";
import { useAdminPayments } from "../../../context/useAdminPayments";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import styles from "./PaymentReportTab.module.css";

const PAGE_SIZE = 5;

function TotalCollectedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3"
        y="6"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="12.5"
        r="2.6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 6V5.2A1.2 1.2 0 0 1 8.2 4h7.6A1.2 1.2 0 0 1 17 5.2V6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3.5"
        y="6"
        width="17"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3.5 10h17" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3.5"
        y="6.5"
        width="17"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="16.5" cy="12.5" r="1.4" fill="currentColor" />
    </svg>
  );
}
function PendingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7.5v5l3.2 2"
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
function currency(n) {
  return `₱${(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}
function methodLabel(m) {
  if (m === "card") return "Card";
  if (m === "gcash") return "GCash";
  if (m === "maya") return "Maya";
  return m || "—";
}
function statusLabel(s) {
  if (s === "successful") return "Paid";
  if (s === "failed") return "Failed";
  return "Pending";
}

const STAT_ICONS = {
  totalCollected: <TotalCollectedIcon />,
  cardPayments: <CardIcon />,
  walletPayments: <WalletIcon />,
  pendingPayments: <PendingIcon />,
};

const STATUS_OPTIONS = ["All Status", "Paid", "Pending", "Failed"];
const METHOD_OPTIONS = ["All Method", "Card", "GCash", "Maya"];

export default function PaymentReportTab({ onViewPayment }) {
  const { payments, loading } = useAdminPayments();
  const { getBookingById } = useAdminBookings();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [methodFilter, setMethodFilter] = useState("All Method");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    return payments.map((p) => {
      const booking = getBookingById(p.bookingId);
      return {
        id: p.id,
        date: formatDate(toDate(p.createdAt)),
        bookingId: `#${p.bookingId}`,
        customer: booking?.customer || "—",
        description: `Payment for booking ${p.bookingRef || p.bookingId}`,
        method: methodLabel(p.method),
        amount: p.amount || 0,
        status: statusLabel(p.status),
        reference: p.bookingRef || p.id,
        sortAt: toDate(p.createdAt)?.getTime() ?? 0,
      };
    });
  }, [payments, getBookingById]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((row) => {
        const matchesSearch =
          !q ||
          row.bookingId.toLowerCase().includes(q) ||
          (row.customer || "").toLowerCase().includes(q) ||
          (row.reference || "").toLowerCase().includes(q);
        const matchesStatus =
          statusFilter === "All Status" || row.status === statusFilter;
        const matchesMethod =
          methodFilter === "All Method" || row.method === methodFilter;
        return matchesSearch && matchesStatus && matchesMethod;
      })
      .sort((a, b) => b.sortAt - a.sortAt);
  }, [rows, search, statusFilter, methodFilter]);

  const pagedRows = useMemo(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filteredRows, page]);

  const resetToFirstPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const successful = payments.filter((p) => p.status === "successful");
  const totalCollected = successful.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );
  const cardTotal = successful
    .filter((p) => p.method === "card")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const walletTotal = successful
    .filter((p) => p.method === "gcash" || p.method === "maya")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingTotal = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const stats = [
    {
      key: "totalCollected",
      label: "Total Payments Collected",
      value: currency(totalCollected),
    },
    { key: "cardPayments", label: "Card Payments", value: currency(cardTotal) },
    {
      key: "walletPayments",
      label: "GCash + Maya Payments",
      value: currency(walletTotal),
    },
    {
      key: "pendingPayments",
      label: "Pending Payments",
      value: currency(pendingTotal),
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
          />
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.filtersRow}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by Booking ID, Customer, or Reference..."
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
            value={methodFilter}
            onChange={(e) => resetToFirstPage(setMethodFilter)(e.target.value)}
          >
            {METHOD_OPTIONS.map((opt) => (
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
                <th>Description</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className={styles.emptyRow}>
                    Loading payments...
                  </td>
                </tr>
              ) : pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className={styles.emptyRow}>
                    No matching payments found.
                  </td>
                </tr>
              ) : (
                pagedRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td>{row.bookingId}</td>
                    <td>{row.customer}</td>
                    <td>{row.description}</td>
                    <td>{row.method}</td>
                    <td>{currency(row.amount)}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td>{row.reference}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => onViewPayment?.(row)}
                        aria-label={`View payment for ${row.bookingId}`}
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
