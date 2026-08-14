import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import styles from "./BookingsOverviewChart.module.css";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
}

export default function BookingsOverviewChart() {
  const { bookings } = useAdminBookings();

  const bookingsData = useMemo(() => {
    const weekStart = startOfWeek();
    const counts = new Array(7).fill(0);

    bookings.forEach((b) => {
      const created = toDate(b.createdAt);
      if (!created || created < weekStart) return;
      counts[created.getDay()] += 1;
    });

    return DAY_LABELS.map((day, i) => ({ day, bookings: counts[i] }));
  }, [bookings]);

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Bookings Overview</h2>
        <button type="button" className={styles.rangeBtn}>
          This Week
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <ResponsiveContainer width="100%" height={296}>
        <BarChart
          data={bookingsData}
          margin={{ top: 16, right: 12, left: -12, bottom: 0 }}
        >
          <CartesianGrid
            stroke="#e5e7eb"
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fill: "#374151" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fill: "#374151" }}
          />
          <Bar
            dataKey="bookings"
            fill="#f7c565"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
