// src/services/bookingsService.js
//
// Single source of truth for the booking lifecycle:
//   pending -> confirmed -> (clearance) -> cleared -> (dispatch preRent) -> ongoing
//   -> (dispatch postRent) -> awaiting_return_review -> (clearance review) -> completed
//
// Used by: customer PaymentPage (create), AdminBookingsContext (list/clearance),
// DispatcherInspectionWizardPage (preRent/postRent checklist).
//
// All vehicle-status side effects are written client-side here, matching the
// existing AdminVehiclesContext pattern (no Cloud Functions in this codebase yet).

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const BOOKINGS = "lykas_bookings";
const PAYMENTS = "lykas_payments";
const VEHICLES = "lykas_vehicles";

function genBookingRef() {
  const n = Math.floor(1000 + Math.random() * 9000);
  const letter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `LYKA-${n}-${letter()}${letter()}`;
}

/* ------------------------------------------------------------------ */
/*  1. CUSTOMER — create booking + payment (PaymentPage "Pay" click)  */
/* ------------------------------------------------------------------ */

/**
 * Creates a lykas_bookings doc (status "pending") and a lykas_payments doc,
 * then marks both "confirmed"/"successful" once payment succeeds.
 * Vehicle stays "available" until dispatch (per architecture doc 4.1) —
 * this function does NOT touch lykas_vehicles.
 */
export async function createBookingWithPayment({
  uid,
  vehicleId,
  driver, // { fullName, email, phone, licenseNo }
  location,
  pickupDate,
  returnDate,
  days,
  dailyRate,
  addons = {},
  subtotal,
  insuranceFee = 0,
  serviceFee = 0,
  total,
  paymentMethod, // "card" | "gcash" | "maya"
  cardLast4 = null,
}) {
  if (!uid) throw new Error("Must be signed in to book.");

  const bookingRef = await addDoc(collection(db, BOOKINGS), {
    uid,
    vehicleId,
    status: "confirmed", // payment succeeds synchronously in this flow
    location,
    pickupDate,
    returnDate,
    days,
    dailyRate,
    addons,
    subtotal,
    insuranceFee,
    serviceFee,
    total,
    driver,
    paymentId: null,
    dispatchedBy: null,
    dispatchedAt: null,
    returnedAt: null,
    clearance: {
      status: null,
      checkedBy: null,
      checkedAt: null,
      licenseVerified: false,
      notes: "",
      rejectionReason: null,
    },
    dispatchChecklist: {
      preRent: null,
      postRent: null,
      status: null,
      reviewedBy: null,
      reviewedAt: null,
    },
    createdAt: serverTimestamp(),
  });

  const bookingRefCode = genBookingRef();

  const paymentDoc = await addDoc(collection(db, PAYMENTS), {
    bookingId: bookingRef.id,
    uid,
    method: paymentMethod,
    amount: total,
    status: "successful",
    cardLast4,
    bookingRef: bookingRefCode,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, BOOKINGS, bookingRef.id), {
    paymentId: paymentDoc.id,
  });

  return {
    bookingId: bookingRef.id,
    paymentId: paymentDoc.id,
    bookingRef: bookingRefCode,
  };
}

/* ------------------------------------------------------------------ */
/*  2. ADMIN — Checklist Admin clearance (docs + standing vehicle check) */
/* ------------------------------------------------------------------ */

/**
 * Clears or rejects a confirmed booking's documents/license check.
 * Does NOT touch the vehicle — vehicle roadworthiness is the standing
 * lykas_vehicles.clearance flow, referenced but not redone here.
 */
export async function submitBookingClearance(
  bookingId,
  {
    staffUid,
    approve, // boolean
    licenseVerified,
    notes = "",
    rejectionReason = null,
  }
) {
  await updateDoc(doc(db, BOOKINGS, bookingId), {
    clearance: {
      status: approve ? "cleared" : "rejected",
      checkedBy: staffUid,
      checkedAt: serverTimestamp(),
      licenseVerified: !!licenseVerified,
      notes,
      rejectionReason: approve ? null : rejectionReason,
    },
  });
}

/* ------------------------------------------------------------------ */
/*  3. DISPATCHER — pre-rent checklist (pickup)                       */
/* ------------------------------------------------------------------ */

export async function submitPreRentChecklist(
  bookingId,
  {
    staffUid,
    vehicleId,
    photos, // { front, back, left, right } — URLs (upload before calling this)
    fuelLevel,
    odometerReading,
    notes = "",
  }
) {
  await updateDoc(doc(db, BOOKINGS, bookingId), {
    "dispatchChecklist.preRent": {
      photos,
      fuelLevel,
      odometerReading: Number(odometerReading),
      notes,
      submittedBy: staffUid,
      submittedAt: serverTimestamp(),
    },
    status: "ongoing",
    dispatchedBy: staffUid,
    dispatchedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, VEHICLES, vehicleId), {
    status: "rented",
    currentBookingId: bookingId,
    updatedAt: serverTimestamp(),
  });
}

/* ------------------------------------------------------------------ */
/*  4. DISPATCHER — post-rent checklist (return)                      */
/* ------------------------------------------------------------------ */

export async function submitPostRentChecklist(
  bookingId,
  { staffUid, photos, fuelLevel, odometerReading, notes = "" }
) {
  await updateDoc(doc(db, BOOKINGS, bookingId), {
    "dispatchChecklist.postRent": {
      photos,
      fuelLevel,
      odometerReading: Number(odometerReading),
      notes,
      submittedBy: staffUid,
      submittedAt: serverTimestamp(),
    },
    "dispatchChecklist.status": "awaiting_return_review",
  });
}

/* ------------------------------------------------------------------ */
/*  5. ADMIN — Checklist Admin return review / booking completion      */
/* ------------------------------------------------------------------ */

export async function submitReturnReview(
  bookingId,
  {
    staffUid,
    vehicleId,
    flaggedDamage = false, // true routes vehicle to "maintenance" instead of "pending_clearance"
  }
) {
  await updateDoc(doc(db, BOOKINGS, bookingId), {
    "dispatchChecklist.status": "return_reviewed",
    "dispatchChecklist.reviewedBy": staffUid,
    "dispatchChecklist.reviewedAt": serverTimestamp(),
    status: "completed",
    returnedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, VEHICLES, vehicleId), {
    status: flaggedDamage ? "maintenance" : "pending_clearance",
    currentBookingId: null,
    updatedAt: serverTimestamp(),
  });
}

/* ------------------------------------------------------------------ */
/*  6. Shared — cancellation                                          */
/* ------------------------------------------------------------------ */

export async function cancelBooking(bookingId) {
  await updateDoc(doc(db, BOOKINGS, bookingId), { status: "cancelled" });
}

export async function getBooking(bookingId) {
  const snap = await getDoc(doc(db, BOOKINGS, bookingId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/* ------------------------------------------------------------------ */
/*  7. ADMIN — flag a booking as returned by the customer, pending     */
/*     dispatcher return inspection. Distinct from                    */
/*     submitPostRentChecklist (#4), which is the DISPATCHER's actual  */
/*     inspection submission (photos, fuel, odometer). This is only   */
/*     the "customer physically brought the unit back" flag from the  */
/*     admin's Active Bookings modal — it does NOT change booking      */
/*     .status, since that still needs the real dispatcher inspection  */
/*     to complete the lifecycle.                                     */
/* ------------------------------------------------------------------ */

export async function flagBookingReturnRequested(bookingId, { staffUid } = {}) {
  await updateDoc(doc(db, BOOKINGS, bookingId), {
    "dispatchChecklist.returnRequested": true,
    "dispatchChecklist.returnRequestedBy": staffUid || null,
    "dispatchChecklist.returnRequestedAt": serverTimestamp(),
  });
}