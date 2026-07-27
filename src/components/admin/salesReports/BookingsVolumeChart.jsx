import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import styles from "./BookingsVolumeChart.module.css";

const CEILING = 100;

export default function BookingsVolumeChart({ data }) {
  const chartData = data.map((d) => ({ ...d, remainder: CEILING - d.bookings }));

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Bookings Overview</h2>
        {/* TODO: wire to a real range selector */}
        <button type="button" className={styles.rangeBtn}>
          Daily
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 24, right: 16, left: -6, bottom: 0 }}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#374151" }} />
          <YAxis
            domain={[0, CEILING]}
            ticks={[0, 20, 40, 60, 80, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fill: "#374151" }}
          />
          <Bar dataKey="bookings" stackId="volume" fill="#f0a93a" radius={[0, 0, 0, 0]} maxBarSize={44}>
            <LabelList dataKey="bookings" position="top" fill="#1a1a1a" fontSize={13} fontWeight={700} />
          </Bar>
          <Bar dataKey="remainder" stackId="volume" fill="#fbe4b8" radius={[6, 6, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        <span className={styles.legendDot} />
        Bookings
      </div>
    </section>
  );
}