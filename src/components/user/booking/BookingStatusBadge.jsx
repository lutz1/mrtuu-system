import React from "react";
import { BOOKING_STATUS } from "../../../data/bookings";
import styles from "./BookingStatusBadge.module.css";

const LABELS = {
  [BOOKING_STATUS.ONGOING]: "Ongoing",
  [BOOKING_STATUS.COMPLETED]: "Completed",
  [BOOKING_STATUS.CANCELLED]: "Cancelled",
};

export default function BookingStatusBadge({ status }) {
  return (
    <span className={`${styles.badge} ${styles[status] || ""}`}>
      {status === BOOKING_STATUS.ONGOING && <span className={styles.dot} />}
      {LABELS[status] || status}
    </span>
  );
}