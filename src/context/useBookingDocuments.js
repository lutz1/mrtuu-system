import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Returns the customer's driver's license + valid ID image URLs for a booking.
// 1. Reads what was saved on the booking itself (booking.documents / booking.driver).
// 2. If either is missing, looks up the customer's profile in Firestore
//    (lykas_customers/{uid}.documents), which keeps their latest uploads.
export function useBookingDocuments(booking) {
  const bookingLicense =
    booking?.documents?.driversLicenseUrl ||
    booking?.driver?.driversLicenseUrl ||
    null;
  const bookingValidId =
    booking?.documents?.validIdUrl || booking?.driver?.validIdUrl || null;
  const uid = booking?.uid || null;
  const needsLookup = !bookingLicense || !bookingValidId;

  const [fallback, setFallback] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid || !needsLookup) return;
    let cancelled = false;
    setLoading(true);
    setFallback({});
    getDoc(doc(db, "lykas_customers", uid))
      .then((snap) => {
        if (!cancelled) setFallback(snap.data()?.documents || {});
      })
      .catch((err) => console.warn("Customer document lookup failed:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid, needsLookup]);

  return {
    loading: needsLookup && loading,
    documents: {
      driversLicenseUrl: bookingLicense || fallback.driversLicenseUrl || null,
      validIdUrl: bookingValidId || fallback.validIdUrl || null,
    },
  };
}
