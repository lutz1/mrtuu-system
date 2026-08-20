import { useMemo, useState } from "react";
import ReportStatCard from "./ReportStatCard";
import ReportPagination from "./ReportPagination";
import StatusBadge from "./StatusBadge";
import { useAdminVehicles } from "../../../context/AdminVehiclesContext";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import styles from "./VehicleReportTab.module.css";

const PAGE_SIZE = 5;

function TotalVehiclesIcon() {
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
function AvailableIcon() {
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
function RentedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9 12.3l2 2 4-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function MaintenanceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.5 6.5a3.5 3.5 0 0 0-4.6 4l-6 6a2 2 0 0 0 2.8 2.8l6-6a3.5 3.5 0 0 0 4-4.6l-2.3 2.3-1.7-.5-.5-1.7 2.3-2.3z"
        stroke="currentColor"
        strokeWidth="1.5"
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
function CarThumbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 14.5l1.3-4.3A1.8 1.8 0 0 1 7 9h10a1.8 1.8 0 0 1 1.7 1.2l1.3 4.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="3"
        y="14.5"
        width="18"
        height="3.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="7.5" cy="18" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="18" r="1.2" fill="currentColor" />
    </svg>
  );
}

// real status -> report status
const STATUS_MAP = {
  Available: "Available",
  "On Rent": "Rented",
  "Under Maintenance": "Maintenance",
  Unavailable: "Unavailable",
};
const STATUS_COLORS = {
  Available: "#6C8CF5",
  Rented: "#33C481",
  Maintenance: "#F2A93B",
  Unavailable: "#9CA3AF",
};

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

const STAT_ICONS = {
  totalVehicles: <TotalVehiclesIcon />,
  availableVehicles: <AvailableIcon />,
  rentedVehicles: <RentedIcon />,
  maintenanceVehicles: <MaintenanceIcon />,
};

const STATUS_OPTIONS = [
  "All Status",
  "Available",
  "Rented",
  "Maintenance",
  "Unavailable",
];
const TRANSMISSION_OPTIONS = ["All Transmission", "Automatic", "Manual"];

function StatusDonut({ segments }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
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

export default function VehicleReportTab({ onViewVehicle }) {
  const { vehicles, loading } = useAdminVehicles();
  const { bookings } = useAdminBookings();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Vehicle Types");
  const [transmissionFilter, setTransmissionFilter] =
    useState("All Transmission");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    return vehicles.map((v) => {
      const vType = v.carType || v.type || "—";
      const vehicleBookings = bookings.filter((b) => b.vehicleId === v.id);
      const revenue = vehicleBookings.reduce(
        (sum, b) => sum + (b.total || 0),
        0
      );
      const lastRentedAt = vehicleBookings
        .flatMap((b) => {
          const d = toDate(b.createdAt);
          return d ? [d] : [];
        })
        .sort((a, b) => b.getTime() - a.getTime())[0];

      return {
        id: v.id,
        name: v.name,
        subtitle: `${v.seats ? `${v.seats} Seater` : "— Seater"} • ${vType}`,
        plate: v.plate || "—",
        type: vType,
        transmission: v.transmission,
        status: STATUS_MAP[v.status] || v.status,
        totalBookings: vehicleBookings.length,
        lastRented: formatDate(lastRentedAt),
        totalRevenue: currency(revenue),
        revenueValue: revenue,
      };
    });
  }, [vehicles, bookings]);

  const typeOptions = useMemo(() => {
    const types = new Set(rows.map((r) => r.type));
    return ["All Vehicle Types", ...Array.from(types)];
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.plate.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All Status" || row.status === statusFilter;
      const matchesType =
        typeFilter === "All Vehicle Types" || row.type === typeFilter;
      const matchesTransmission =
        transmissionFilter === "All Transmission" ||
        row.transmission === transmissionFilter;
      return (
        matchesSearch && matchesStatus && matchesType && matchesTransmission
      );
    });
  }, [rows, search, statusFilter, typeFilter, transmissionFilter]);

  const pagedRows = useMemo(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filteredRows, page]);

  const resetToFirstPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const statusCounts = rows.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  const statusBreakdown = ["Available", "Rented", "Maintenance", "Unavailable"]
    .map((label) => ({
      label,
      value: statusCounts[label] || 0,
      color: STATUS_COLORS[label],
    }))
    .filter((s) => s.value > 0);
  const statusTotal = statusBreakdown.reduce((sum, s) => sum + s.value, 0) || 1;

  const topVehicles = rows
    .toSorted((a, b) => b.revenueValue - a.revenueValue)
    .slice(0, 5);
  const totalRevenue = rows.reduce((sum, r) => sum + r.revenueValue, 0);

  const stats = [
    {
      key: "totalVehicles",
      label: "Total Vehicles",
      value: String(rows.length),
      helper: "Total vehicles in showroom",
    },
    {
      key: "availableVehicles",
      label: "Available Vehicles",
      value: String(statusCounts.Available || 0),
      helper: "Ready for rent",
    },
    {
      key: "rentedVehicles",
      label: "Rented Vehicles",
      value: String(statusCounts.Rented || 0),
      helper: "Currently rented",
    },
    {
      key: "maintenanceVehicles",
      label: "Maintenance",
      value: String(statusCounts.Maintenance || 0),
      helper: "Under maintenance",
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
            comparisonLabel={stat.helper}
          />
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.filtersRow}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name or plate..."
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
            {typeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            value={transmissionFilter}
            onChange={(e) =>
              resetToFirstPage(setTransmissionFilter)(e.target.value)
            }
          >
            {TRANSMISSION_OPTIONS.map((opt) => (
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
                <th>Vehicle</th>
                <th>Plate Number</th>
                <th>Type</th>
                <th>Transmission</th>
                <th>Status</th>
                <th>Total Bookings</th>
                <th>Last Rented</th>
                <th>Total Revenue</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className={styles.emptyRow}>
                    Loading vehicles...
                  </td>
                </tr>
              ) : pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className={styles.emptyRow}>
                    No matching vehicles found.
                  </td>
                </tr>
              ) : (
                pagedRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className={styles.vehicleCell}>
                        <span className={styles.thumb}>
                          <CarThumbIcon />
                        </span>
                        <div className={styles.vehicleInfo}>
                          <span className={styles.vehicleName}>{row.name}</span>
                          <span className={styles.vehicleSubtitle}>
                            {row.subtitle}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{row.plate}</td>
                    <td>{row.type}</td>
                    <td>{row.transmission}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td>{row.totalBookings}</td>
                    <td>{row.lastRented}</td>
                    <td>{row.totalRevenue}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => onViewVehicle?.(row)}
                        aria-label={`View ${row.name}`}
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

      <div className={styles.bottomGrid}>
        <div className={styles.card}>
          <h3 className={styles.widgetTitle}>Vehicle by Status</h3>
          <div className={styles.donutRow}>
            <StatusDonut segments={statusBreakdown} />
            <ul className={styles.legend}>
              {statusBreakdown.map((seg) => (
                <li key={seg.label} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{ background: seg.color }}
                  />
                  <span className={styles.legendLabel}>{seg.label}</span>
                  <span className={styles.legendValue}>
                    {seg.value}({((seg.value / statusTotal) * 100).toFixed(2)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.topHeader}>
            <h3 className={styles.widgetTitle}>Top 5 Vehicles by Revenue</h3>
            <div className={styles.totalRevenue}>
              <span className={styles.totalRevenueLabel}>Total Revenue</span>
              <span className={styles.totalRevenueValue}>
                {currency(totalRevenue)}
              </span>
            </div>
          </div>
          <ol className={styles.topList}>
            {topVehicles.map((v, i) => (
              <li key={v.id} className={styles.topItem}>
                <span>
                  {i + 1}. {v.name}
                </span>
                <span className={styles.topRevenue}>{v.totalRevenue}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className={styles.footerNote}>
        All amounts are in Philippine Peso (PHP)
      </p>
    </>
  );
}
