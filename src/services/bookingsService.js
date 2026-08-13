// src/services/bookingsService.js

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";

const BOOKINGS = "lykas_bookings";
const PAYMENTS = "lykas_payments";
const VEHICLES = "lykas_vehicles";

function genBookingRef() {
  const n = Math.floor(1000 + Math.random() * 9000);
  const letter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `LYKA-${n}-${letter()}${letter()}`;
}

/**
 * Uploads a raw File object to Firebase Storage and returns its public download URL
 */
async function uploadDocFile(file, path) {
  if (!file || !(file instanceof File)) return null;
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

/* ------------------------------------------------------------------ */
/*  1. CUSTOMER — create booking + payment                            */
/* ------------------------------------------------------------------ */

export async function createBookingWithPayment({
  uid,
  vehicleId,
  driver, // { fullName, email, phone, licenseNo }
  files = {}, // { driversLicense: File, validId: File }
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
  paymentMethod,
  cardLast4 = null,
}) {
  if (!uid) throw new Error("Must be signed in to book.");

  // 1. Upload driver documents to Firebase Storage
  let driversLicenseUrl = null;
  let validIdUrl = null;

  try {
    if (files.driversLicense) {
      driversLicenseUrl = typeof files.driversLicense === "string"
        ? files.driversLicense
        : await uploadDocFile(files.driversLicense, `documents/${uid}/drivers_license`);
    }

    if (files.validId) {
      validIdUrl = typeof files.validId === "string"
        ? files.validId
        : await uploadDocFile(files.validId, `documents/${uid}/valid_id`);
    }
  } catch (uploadErr) {
    console.error("Error uploading driver documents:", uploadErr);
  }

  // 2. Create the booking document with valid image URLs
  const bookingRef = await addDoc(collection(db, BOOKINGS), {
    uid,
    vehicleId,
    status: "confirmed",
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
    driver: {
      ...driver,
      driversLicenseUrl,
      validIdUrl,
    },
    documents: {
      driversLicenseUrl,
      validIdUrl,
    },
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
/*  2. ADMIN — Clearance                                              */
/* ------------------------------------------------------------------ */

export async function submitBookingClearance(
  bookingId,
  { staffUid, approve, licenseVerified, notes = "", rejectionReason = null }
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
/*  3. DISPATCHER — Pre-rent inspection                               */
/* ------------------------------------------------------------------ */

export async function submitPreRentChecklist(
  bookingId,
  { staffUid, vehicleId, photos, fuelLevel, odometerReading, notes = "" }
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
/*  4. DISPATCHER — Post-rent inspection                              */
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
/*  5. ADMIN — Return review                                          */
/* ------------------------------------------------------------------ */

export async function submitReturnReview(
  bookingId,
  { staffUid, vehicleId, flaggedDamage = false }
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

export async function cancelBooking(bookingId) {
  await updateDoc(doc(db, BOOKINGS, bookingId), { status: "cancelled" });
}

export async function getBooking(bookingId) {
  const snap = await getDoc(doc(db, BOOKINGS, bookingId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function flagBookingReturnRequested(bookingId, { staffUid } = {}) {
  await updateDoc(doc(db, BOOKINGS, bookingId), {
    "dispatchChecklist.returnRequested": true,
    "dispatchChecklist.returnRequestedBy": staffUid || null,
    "dispatchChecklist.returnRequestedAt": serverTimestamp(),
  });
}