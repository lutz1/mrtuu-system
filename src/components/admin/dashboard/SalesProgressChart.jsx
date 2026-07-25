import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import styles from "./SalesProgressChart.module.css";

// TODO: mock data — swap for real weekly sales once available. The
// "This Week" dropdown is currently a static label, not a real control.
const SALES_DATA = [
  { day: "Mon", sales: 56 },
  { day: "Tue", sales: 64 },
  { day: "Wed", sales: 76 },
  { day: "Thu", sales: 79 },
  { day: "Fri", sales: 68 },
  { day: "Sat", sales: 42 },
];

function Dot(props) {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="#f0a93a" opacity={0.18} />
      <circle cx={cx} cy={cy} r={4} fill="#f0a93a" stroke="#ffffff" strokeWidth={1.5} />
    </g>
  );
}

export default function SalesProgressChart() {
  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Car Rent Sales Progress</h2>
        {/* TODO: wire to a real range selector */}
        <button type="button" className={styles.rangeBtn}>
          This Week
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={SALES_DATA} margin={{ top: 16, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" vertical={true} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#374151" }} />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fill: "#374151" }}
          />
          <Line type="monotone" dataKey="sales" stroke="#f0a93a" strokeWidth={2.5} dot={<Dot />} />
        </LineChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        <span className={styles.legendDot} />
        Sales (PHP)
      </div>
    </section>
  );
}