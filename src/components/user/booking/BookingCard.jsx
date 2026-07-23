import React from "react";
import { CARS } from "../../../data/cars";
import { BOOKING_STATUS } from "../../../data/bookings";
import { formatDateRange, formatSingleDate } from "../../../utils/formatDate";
import BookingStatusBadge from "./BookingStatusBadge";
import styles from "./BookingCard.module.css";

function TransmissionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4v16M6 12h12M18 4v6M18 16v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function FuelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 20V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14M5 20h10M16 9h1.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0v-4.5L19.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SeatsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 18c0-2.5 2.2-4 5-4s5 1.5 5 4M11 18c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function BookingCard({ booking, onExtendTrip, onSupport, onDownloadInvoice, onRentAgain, onViewDetails }) {
  const car = CARS.find((c) => c.id === booking.carId);
  if (!car) return null;

  const image = car.images?.[0];

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={image} alt={car.name} className={styles.image} />
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className={styles.details}>
        <div className={styles.headerRow}>
          <h3 className={styles.carName}>{car.name}</h3>
          <span className={styles.price}>
            ₱{booking.price.toLocaleString("en-PH", { minimumFractionDigits: booking.status === BOOKING_STATUS.CANCELLED ? 2 : 0 })}
          </span>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <CalendarIcon />
            {formatDateRange(booking.startDate, booking.endDate)}
          </span>
          {booking.location && (
            <span className={styles.metaItem}>
              <PinIcon />
              {booking.location}
            </span>
          )}
        </div>

        {booking.status === BOOKING_STATUS.ONGOING && (
          <div className={styles.specPills}>
            <span className={styles.pill}>
              <TransmissionIcon /> {car.transmission}
            </span>
            <span className={styles.pill}>
              <FuelIcon /> {car.fuelType}
            </span>
            <span className={styles.pill}>
              <SeatsIcon /> {car.seats} Seats
            </span>
          </div>
        )}

        {booking.status === BOOKING_STATUS.CANCELLED && booking.refundedOn && (
          <p className={styles.refundNote}>Refunded on {formatSingleDate(booking.refundedOn)}</p>
        )}

        <div className={styles.actions}>
          {booking.status === BOOKING_STATUS.ONGOING && (
            <>
              <button type="button" className={styles.primaryBtn} onClick={() => onExtendTrip?.(booking)}>
                Extend Trip
              </button>
              <button type="button" className={styles.outlineBtn} onClick={() => onSupport?.(booking)}>
                Support
              </button>
            </>
          )}

          {booking.status === BOOKING_STATUS.COMPLETED && (
            <>
              <button type="button" className={styles.grayBtn} onClick={() => onDownloadInvoice?.(booking)}>
                Download Invoice
              </button>
              <button type="button" className={styles.outlineBtn} onClick={() => onRentAgain?.(booking)}>
                Rent Again
              </button>
            </>
          )}

          {booking.status === BOOKING_STATUS.CANCELLED && (
            <button type="button" className={styles.grayBtnFull} onClick={() => onViewDetails?.(booking)}>
              View Details
            </button>
          )}
        </div>
      </div>
    </article>
  );
}