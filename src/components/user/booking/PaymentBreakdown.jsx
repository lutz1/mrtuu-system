import styles from "./PaymentBreakdown.module.css";

export default function PaymentBreakdown({ total }) {
  const half = Math.round(total / 2);

  return (
    <div className={styles.card}>
      <div className={styles.heading}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2.5" y="5.5" width="19" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M2.5 9.5h19" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <h3 className={styles.title}>Payment Breakdown</h3>
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Pay Online (50%)</div>
          <div className={styles.rowSub}>Pay now to confirm your booking</div>
        </div>
        <span className={styles.rowValue}>₱{half.toLocaleString()}</span>
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Pay at Front Desk (50%)</div>
          <div className={styles.rowSub}>Due at Lykas front desk upon pickup</div>
        </div>
        <span className={styles.rowValue}>₱{(total - half).toLocaleString()}</span>
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total Price</span>
        <span className={styles.totalValue}>₱{total.toLocaleString()}</span>
      </div>

      <div className={styles.note}>
        <svg className={styles.noteIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 11v5.5M12 8v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <p className={styles.noteText}>
          The remaining 50% is payable at the Lykas front desk when you pick up the vehicle.
        </p>
      </div>
    </div>
  );
}