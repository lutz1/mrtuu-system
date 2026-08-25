import { createPortal } from "react-dom";
import { useToast } from "../../../context/ToastContext";
import styles from "./ToastContainer.module.css";

function ToastIcon({ type }) {
  if (type === "success") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#22a35e" />
        <path d="M8 12.3l2.5 2.5L16 9.3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "error") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#e0483e" />
        <path d="M12 7.5v6M12 16.5h.01" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#374151" />
      <path d="M12 8v.01M12 11v5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return createPortal(
    <div className={styles.stack}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type] || ""}`}>
          <span className={styles.icon}>
            <ToastIcon type={toast.type} />
          </span>
          <span className={styles.message}>{toast.message}</span>
          <button type="button" className={styles.closeBtn} onClick={() => dismissToast(toast.id)} aria-label="Dismiss">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}