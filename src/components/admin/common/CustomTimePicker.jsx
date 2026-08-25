import { useState, useEffect, useRef } from "react";
import styles from "./CustomTimePicker.module.css";

// Helper: Convert "HH:mm" (24h) to { hour: "12", minute: "00", period: "AM" }
function parse24Hour(timeStr) {
  if (!timeStr) return { hour: "09", minute: "00", period: "AM" };
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ? mStr.padStart(2, "0") : "00";
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return {
    hour: String(h).padStart(2, "0"),
    minute: m,
    period: period,
  };
}

// Helper: Convert { hour, minute, period } back to "HH:mm" (24h)
function formatTo24Hour(hour, minute, period) {
  let h = parseInt(hour, 10) || 12;
  if (period === "PM" && h < 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  const hStr = String(h).padStart(2, "0");
  const mStr = String(minute).padStart(2, "0");
  return `${hStr}:${mStr}`;
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export default function CustomTimePicker({ value, onChange, placeholder = "Select time", inputClassName }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const initialParsed = parse24Hour(value);
  const [hour, setHour] = useState(initialParsed.hour);
  const [minute, setMinute] = useState(initialParsed.minute);
  const [period, setPeriod] = useState(initialParsed.period);

  // Keep internal state updated when form prop changes
  useEffect(() => {
    const parsed = parse24Hour(value);
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [value]);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    const formatted = formatTo24Hour(hour, minute, period);
    onChange(formatted);
    setIsOpen(false);
  };

  const displayFormattedValue = value ? `${hour}:${minute} ${period}` : "";

  return (
    <div className={styles.wrapper} ref={popoverRef}>
      <input
        type="text"
        readOnly
        className={inputClassName}
        value={displayFormattedValue}
        placeholder={placeholder}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {isOpen && (
        <div className={styles.modalCard}>
          <div className={styles.modalHeader}>Select Time</div>

          <div className={styles.pickerGrid}>
            {/* Hour Selector */}
            <div className={styles.column}>
              <label className={styles.colLabel}>Hour</label>
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className={styles.selectInput}
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.separator}>:</div>

            {/* Minute Selector */}
            <div className={styles.column}>
              <label className={styles.colLabel}>Min</label>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className={styles.selectInput}
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* AM / PM Segmented Control */}
            <div className={styles.column}>
              <label className={styles.colLabel}>Period</label>
              <div className={styles.periodToggle}>
                <button
                  type="button"
                  className={`${styles.periodBtn} ${period === "AM" ? styles.activePeriod : ""}`}
                  onClick={() => setPeriod("AM")}
                >
                  AM
                </button>
                <button
                  type="button"
                  className={`${styles.periodBtn} ${period === "PM" ? styles.activePeriod : ""}`}
                  onClick={() => setPeriod("PM")}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button type="button" className={styles.applyBtn} onClick={handleApply}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}