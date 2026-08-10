import React from "react";
import styles from "./BookingSummaryCards.module.css";

function CustomerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function VehicleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 15l1.5-5A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="15" width="18" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PesoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 5h6a4 4 0 0 1 0 8H7V5zM7 5v14M4 10h9M4 13h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BookingSummaryCards({ booking }) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.iconCircle}>
          <CustomerIcon />
        </span>
        <div>
          <p className={styles.label}>Customer</p>
          <p className={styles.primary}>{booking.customer}</p>
          <p className={styles.secondary}>{booking.phone}</p>
          {booking.driver?.email && <p className={styles.secondary}>{booking.driver.email}</p>}
        </div>
      </div>

      <div className={styles.card}>
        <span className={styles.iconCircle}>
          <VehicleIcon />
        </span>
        <div>
          <p className={styles.label}>Vehicle</p>
          <p className={styles.primary}>{booking.vehicle}</p>
          <p className={styles.secondary}>{booking.plate}</p>
        </div>
      </div>

      <div className={styles.card}>
        <span className={styles.iconCircle}>
          <CalendarIcon />
        </span>
        <div>
          <p className={styles.label}>Rental Period</p>
          <p className={styles.primary}>
            {booking.pickupDateDisplay} <span className={styles.time}>{booking.pickupTime}</span>
          </p>
          <p className={styles.secondary}>Pickup</p>
          <p className={styles.primary}>
            {booking.returnDateDisplay} <span className={styles.time}>{booking.returnTime}</span>
          </p>
          <p className={styles.secondary}>Return</p>
        </div>
      </div>

      <div className={styles.card}>
        <span className={styles.iconCircle}>
          <PesoIcon />
        </span>
        <div>
          <p className={styles.label}>Total Amount</p>
          <p className={styles.amount}>₱{(booking.total ?? 0).toLocaleString()}.00</p>
          <p className={styles.secondary}>
            {booking.days ?? 1} day{(booking.days ?? 1) !== 1 ? "s" : ""} • ₱{(booking.dailyRate ?? 0).toLocaleString()}/day
          </p>
        </div>
      </div>
    </div>
  );
}