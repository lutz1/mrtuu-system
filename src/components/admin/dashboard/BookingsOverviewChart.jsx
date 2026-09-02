import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import { bucketByRange } from "../../../utils/dashboardTimeRanges";
import RangeDropdown from "./RangeDropdown";
import styles from "./BookingsOverviewChart.module.css";

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function BookingsOverviewChart() {
  const { bookings } = useAdminBookings();
  const [range, setRange] = useState("This Week");

  const bookingsData = useMemo(() => {
    const buckets = bucketByRange(bookings, range, (b) => toDate(b.createdAt));
    return buckets.map(({ label, value }) => ({ day: label, bookings: value }));
  }, [bookings, range]);

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Bookings Overview</h2>
        <RangeDropdown value={range} onChange={setRange} />
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