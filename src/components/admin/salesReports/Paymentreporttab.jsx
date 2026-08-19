import { useMemo, useState } from "react";
import ReportStatCard from "./ReportStatCard";
import ReportPagination from "./ReportPagination";
import StatusBadge from "./StatusBadge";
import { PAYMENT_REPORT_ROWS, PAYMENT_REPORT_STATS, PAGE_SIZE } from "./mockReportsData";
import styles from "./PaymentReportTab.module.css";

function TotalCollectedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12.5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 6V5.2A1.2 1.2 0 0 1 8.2 4h7.6A1.2 1.2 0 0 1 17 5.2V6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function OnlinePaymentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.4 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.4-3.4-8.5S9.8 5.8 12 3.5Z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function FrontDeskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="7.5" width="17" height="11.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 11.5h17" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 4.5h8l1.5 3h-11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function PendingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5v5l3.2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
  totalCollected: <TotalCollectedIcon />,
  onlinePayments: <OnlinePaymentIcon />,
  frontDeskPayments: <FrontDeskIcon />,
  pendingPayments: <PendingIcon />,
};

const STATUS_OPTIONS = ["All Status", "Paid", "Pending"];
const METHOD_OPTIONS = ["All Method", "Online", "Front Desk"];

const currency = (n) => `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

export default function PaymentReportTab({ onViewPayment }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [methodFilter, setMethodFilter] = useState("All Method");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PAYMENT_REPORT_ROWS.filter((row) => {
      const matchesSearch =
        !q ||
        row.bookingId.toLowerCase().includes(q) ||
        row.customer.toLowerCase().includes(q) ||
        row.reference.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All Status" || row.status === statusFilter;
      const matchesMethod = methodFilter === "All Method" || row.method === methodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [search, statusFilter, methodFilter]);

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
        {PAYMENT_REPORT_STATS.map((stat) => (
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
              placeholder="Search by Booking ID, Customer, or Number..."
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

          <button type="button" className={styles.filterBtn}>
            Filter
          </button>
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
                <th>Reference/ OR No.</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 ? (
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

      <p className={styles.footerNote}>All amounts are in Philippine Peso (PHP)</p>
    </>
  );
}