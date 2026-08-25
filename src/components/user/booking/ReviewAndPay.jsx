import styles from "./ReviewAndPay.module.css";

export default function ReviewAndPay({ total, agreed, onAgreeChange, onPay, disabled }) {
  const half = Math.round(total / 2);

  return (
    <section className={styles.card}>
      <div className={styles.heading}>
        <svg className={styles.headingIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3.5h9l3 3V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <h2 className={styles.title}>Review &amp; Pay</h2>
      </div>

      <div className={styles.infoBox}>
        <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 11v5.5M12 8v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <div>
          <p className={styles.infoTitle}>Important</p>
          <p className={styles.infoText}>
            You are required to pay 50% of the total price online to confirm your booking.
          </p>
          <p className={styles.infoText}>
            The remaining 50% will be collected at the Lykas front desk upon pickup.
          </p>
        </div>
      </div>

      <label className={styles.agreeRow}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={agreed}
          onChange={(e) => onAgreeChange(e.target.checked)}
        />
        <span>
          I agree to the{" "}
          <a href="/terms" className={styles.link}>Rental Terms &amp; Conditions</a> and{" "}
          <a href="/privacy" className={styles.link}>Privacy Policy</a>.
        </span>
      </label>

      <button
        type="button"
        className={styles.payButton}
        onClick={onPay}
        disabled={disabled || !agreed}
      >
        <svg className={styles.lockIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="10.5" width="14" height="9.5" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 10.5V7.5a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        Pay 50% Now (₱{half.toLocaleString()})
      </button>

      <p className={styles.secureNote}>Secure payment powered by trusted payment partners.</p>
    </section>
  );
}