import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useBookingsTrend, GRANULARITY_OPTIONS } from "../../../context/useTrendData";
import styles from "./BookingsVolumeChart.module.css";

export default function BookingsVolumeChart() {
  const [granularity, setGranularity] = useState("daily");
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { data } = useBookingsTrend(granularity);

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

  const ceiling = Math.max(10, ...data.map((d) => d.bookings)) + 5;
  const chartData = data.map((d) => ({
    ...d,
    remainder: ceiling - d.bookings,
  }));

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Bookings Overview</h2>

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
        <BarChart
          data={chartData}
          margin={{ top: 24, right: 16, left: -6, bottom: 0 }}
        >
          <CartesianGrid
            stroke="#e5e7eb"
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fill: "#374151" }}
          />
          <YAxis
            domain={[0, ceiling]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fill: "#374151" }}
          />
          <Bar
            dataKey="bookings"
            stackId="volume"
            fill="#f0a93a"
            radius={[0, 0, 0, 0]}
            maxBarSize={44}
          >
            <LabelList
              dataKey="bookings"
              position="top"
              fill="#1a1a1a"
              fontSize={13}
              fontWeight={700}
            />
          </Bar>
          <Bar
            dataKey="remainder"
            stackId="volume"
            fill="#fbe4b8"
            radius={[6, 6, 0, 0]}
            maxBarSize={44}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        <span className={styles.legendDot} />
        Bookings
      </div>
    </section>
  );
}