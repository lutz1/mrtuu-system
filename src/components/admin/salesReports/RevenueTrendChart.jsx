import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import styles from "./RevenueTrendChart.module.css";

function formatPHP(value) {
  return `₱${value.toLocaleString()}`;
}

function Dot(props) {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="#f0a93a" opacity={0.18} />
      <circle cx={cx} cy={cy} r={4} fill="#f0a93a" stroke="#ffffff" strokeWidth={1.5} />
    </g>
  );
}

export default function RevenueTrendChart({ data }) {
  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Revenue Overview</h2>
        {/* TODO: wire to a real range selector */}
        <button type="button" className={styles.rangeBtn}>
          Daily
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#374151" }} />
          <YAxis
            domain={[0, 25000]}
            ticks={[0, 5000, 10000, 15000, 20000, 25000]}
            tickFormatter={formatPHP}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#374151" }}
            width={70}
          />
          <Line type="monotone" dataKey="revenue" stroke="#f0a93a" strokeWidth={2.5} dot={<Dot />} />
        </LineChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        <span className={styles.legendDot} />
        Revenue (PHP)
      </div>
    </section>
  );
}