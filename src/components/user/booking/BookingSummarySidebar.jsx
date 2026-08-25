import styles from "./BookingSummarySidebar.module.css";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function BookingSummarySidebar({
  car,
  location,
  pickupDate,
  returnDate,
  days,
  subtotal,
  feesAndTaxes,
  addonsTotal,
  total,
  onProceed,
}) {
  return (
    <aside className={styles.summaryCard}>
      <img src={car.images[0]} alt={car.name} className={styles.summaryImage} />

      <div className={styles.summaryBody}>
        <h3 className={styles.summaryCarName}>{car.name}</h3>
        <div className={styles.summaryLocation}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          {location}
        </div>

        <div className={styles.summaryDates}>
          <div>
            <span className={styles.summaryDateLabel}>PICK-UP</span>
            <span className={styles.summaryDateValue}>{formatDate(pickupDate)}</span>
          </div>
          <div className={styles.summaryDateRight}>
            <span className={styles.summaryDateLabel}>DROP-OFF</span>
            <span className={styles.summaryDateValue}>{formatDate(returnDate)}</span>
          </div>
        </div>

        <div className={styles.summaryBreakdown}>
          <div className={styles.summaryRow}>
            <span>Rental ({days} day{days !== 1 ? "s" : ""})</span>
            <span>₱{subtotal.toLocaleString()}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Fees &amp; Taxes</span>
            <span>₱{feesAndTaxes.toLocaleString()}</span>
          </div>
          {addonsTotal > 0 && (
            <div className={styles.summaryRow}>
              <span>Add-ons</span>
              <span>₱{addonsTotal.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className={styles.summaryTotalRow}>
          <span className={styles.summaryTotalLabel}>Total Price</span>
          <span className={styles.summaryTotalAmount}>₱{total.toLocaleString()}</span>
        </div>

        <button type="button" className={styles.proceedBtn} onClick={onProceed}>
          Proceed to Payment
        </button>
        <p className={styles.termsNote}>
          By clicking proceed, you agree to our Rental Terms &amp; Conditions.
        </p>
      </div>
    </aside>
  );
}