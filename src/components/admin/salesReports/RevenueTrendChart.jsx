import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useRevenueTrend, GRANULARITY_OPTIONS } from "../../../context/useTrendData";
import styles from "./RevenueTrendChart.module.css";

function formatPHP(value) {
  return `₱${value.toLocaleString()}`;
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

export default function RevenueTrendChart() {
  const [granularity, setGranularity] = useState("daily");
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { data } = useRevenueTrend(granularity);

  const activeLabel =
    GRANULARITY_OPTIONS.find((o) => o.value === granularity)?.label || "Daily";

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Revenue Overview</h2>

        <div className={styles.rangeWrapper} ref={wrapperRef}>
          <button
            type="button"
            className={styles.rangeBtn}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
          >
            {activeLabel}
            <svg
              className={`${styles.chevron} ${menuOpen ? styles.chevronOpen : ""}`}
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

          {menuOpen && (
            <ul className={styles.dropdownMenu} role="listbox">
              {GRANULARITY_OPTIONS.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={opt.value === granularity}
                    className={`${styles.dropdownItem} ${
                      opt.value === granularity ? styles.dropdownItemActive : ""
                    }`}
                    onClick={() => {
                      setGranularity(opt.value);
                      setMenuOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fill: "#374151" }}
          />
          <YAxis
            tickFormatter={formatPHP}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#374151" }}
            width={70}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#f0a93a"
            strokeWidth={2.5}
            dot={<Dot />}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        <span className={styles.legendDot} />
        Revenue (PHP)
      </div>
    </section>
  );
}