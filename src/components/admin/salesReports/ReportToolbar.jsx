import { useEffect, useRef, useState } from "react";
import styles from "./ReportToolbar.module.css";

export default function ReportToolbar({
  period,
  periodLabel,
  periodOptions = [],
  onPeriodChange,
  onExport,
  exportLabel = "Export Report",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleSelect = (value) => {
    setMenuOpen(false);
    if (onPeriodChange) onPeriodChange(value);
  };

  return (
    <div className={styles.row}>
      <div className={styles.dateWrapper} ref={wrapperRef}>
        <button
          type="button"
          className={styles.dateBtn}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="3.5"
              y="5"
              width="17"
              height="15"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M8 3v3.5M16 3v3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          {periodLabel}
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
            {periodOptions.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.value === period}
                  className={`${styles.dropdownItem} ${
                    opt.value === period ? styles.dropdownItemActive : ""
                  }`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="button" className={styles.exportBtn} onClick={onExport}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 15V4M8 8l4-4 4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {exportLabel}
      </button>
    </div>
  );
}