import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import styles from "./SalesProgressChart.module.css";

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

function Dot(props) {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="#f0a93a" opacity={0.18} />
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#f0a93a"
        stroke="#ffffff"
        strokeWidth={1.5}
      />
    </g>
  );
}

export default function SalesProgressChart() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "lykas_payments"),
      where("status", "==", "successful")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => setPayments(snapshot.docs.map((d) => d.data())),
      (err) => console.error("Failed to load payments:", err)
    );
    return unsubscribe;
  }, []);

  const salesData = useMemo(() => {
    const weekStart = startOfWeek();
    const totals = new Array(7).fill(0);

    payments.forEach((p) => {
      const created = toDate(p.createdAt);
      if (!created || created < weekStart) return;
      const dayIndex = created.getDay();
      totals[dayIndex] += p.amount || 0;
    });

    return DAY_LABELS.map((day, i) => ({ day, sales: totals[i] }));
  }, [payments]);

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Car Rent Sales Progress</h2>
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

      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={salesData}
          margin={{ top: 16, right: 12, left: -12, bottom: 0 }}
        >
          <CartesianGrid
            stroke="#e5e7eb"
            strokeDasharray="4 4"
            vertical={true}
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
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#f0a93a"
            strokeWidth={2.5}
            dot={<Dot />}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        <span className={styles.legendDot} />
        Sales (PHP)
      </div>
    </section>
  );
}
