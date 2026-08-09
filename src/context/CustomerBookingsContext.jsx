// src/context/CustomerBookingsContext.jsx
//
// Customer-facing counterpart to AdminBookingsContext. Subscribes to only
// the signed-in user's own lykas_bookings docs (uid == auth.uid), used by
// MyBookingsPage. Booking *creation* happens in PaymentPage via
// bookingsService.createBookingWithPayment — this context is read-only.

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

const CustomerBookingsContext = createContext(null);

export function CustomerBookingsProvider({ children }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "lykas_bookings"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setBookings(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load your bookings:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  const value = useMemo(() => ({ bookings, loading }), [bookings, loading]);

  return (
    <CustomerBookingsContext.Provider value={value}>
      {children}
    </CustomerBookingsContext.Provider>
  );
}

export function useCustomerBookings() {
  const context = useContext(CustomerBookingsContext);
  if (!context) {
    throw new Error(
      "useCustomerBookings must be used within a CustomerBookingsProvider"
    );
  }
  return context;
}
