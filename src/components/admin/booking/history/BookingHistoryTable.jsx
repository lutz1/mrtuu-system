import styles from "./BookingHistoryTable.module.css";

export default function BookingHistoryTable({ bookings, onViewDetails }) {
  if (bookings.length === 0) {
    return (
      <div className={styles.empty}>
        No bookings match your search or filter.
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Rental Period</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => {
            const status = b.status?.toLowerCase() || "pending";

            return (
              <tr key={b.id}>
                {/* Booking ID */}
                <td
                  data-label="Booking ID"
                  className={styles.bookingId}
                >
                  {b.id}
                </td>

                {/* Customer */}
                <td data-label="Customer">
                  <p className={styles.primaryText}>
                    {b.customer}
                  </p>

                  <p className={styles.secondaryText}>
                    {b.phone}
                  </p>
                </td>

                {/* Vehicle */}
                <td data-label="Vehicle">
                  <p className={styles.primaryText}>
                    {b.vehicle}
                  </p>

                  <p className={styles.secondaryText}>
                    {b.plate}
                  </p>
                </td>

                {/* Rental Period */}
                <td data-label="Rental Period">
                  <p className={styles.primaryText}>
                    {b.pickupDateDisplay} - {b.returnDateDisplay}
                  </p>

                  <p className={styles.secondaryText}>
                    {b.days ?? 1} Days
                  </p>
                </td>

                {/* Status */}
                <td data-label="Status">
                  <span
                    className={`${styles.status} ${
                      styles[status] || styles.pending
                    }`}
                  >
                    {b.status || "Pending"}
                  </span>
                </td>

                {/* Total Amount */}
                <td
                  data-label="Total Amount"
                  className={styles.amount}
                >
                  ₱{(b.total ?? 0).toLocaleString()}.00
                </td>

                {/* Actions */}
                <td
                  data-label="Actions"
                  className={styles.actionsCell}
                >
                  <button
                    type="button"
                    className={styles.viewBtn}
                    onClick={() => onViewDetails(b)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}