import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import styles from "./BookingsOverviewChart.module.css";

// TODO: mock data — swap for real weekly bookings once available.
const BOOKINGS_DATA = [
  { day: "Mon", bookings: 55 },
  { day: "Tue", bookings: 64 },
  { day: "Wed", bookings: 76 },
  { day: "Thu", bookings: 79 },
  { day: "Fri", bookings: 70 },
  { day: "Sat", bookings: 37 },
];

export default function BookingsOverviewChart() {
  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Bookings Overview</h2>
        {/* TODO: wire to a real range selector */}
        <button type="button" className={styles.rangeBtn}>
          This Week
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <ResponsiveContainer width="100%" height={296}>
        <BarChart data={BOOKINGS_DATA} margin={{ top: 16, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#374151" }} />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fill: "#374151" }}
          />
          <Bar dataKey="bookings" fill="#f7c565" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}