import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { usePayments } from "../../../context/PaymentsContext";
import { bucketByRange } from "../../../utils/dashboardTimeRanges";
import RangeDropdown from "./RangeDropdown";
import styles from "./SalesProgressChart.module.css";

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
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
  const { payments } = usePayments();
  const [range, setRange] = useState("This Week");

  const salesData = useMemo(() => {
    const successful = payments.filter((p) => p.status === "successful");
    const buckets = bucketByRange(
      successful,
      range,
      (p) => toDate(p.createdAt),
      (p) => p.amount || 0
    );
    return buckets.map(({ label, value }) => ({ day: label, sales: value }));
  }, [payments, range]);

  function formatCompactNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  const abs = Math.abs(value);

  if (abs >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions % 1 === 0 ? millions : millions.toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    const thousands = value / 1_000;
    return `${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}K`;
  }
  return `${value}`;
}

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Car Rent Sales Progress</h2>
        <RangeDropdown value={range} onChange={setRange} />
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart
        data={salesData}
        margin={{ top: 16, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" vertical={true} />
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
          tickFormatter={formatCompactNumber}
          width={48}
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