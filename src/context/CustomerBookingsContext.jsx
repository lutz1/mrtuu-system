// src/context/CustomerBookingsContext.jsx
//
// Customer-facing counterpart to AdminBookingsContext. Subscribes to only
// the signed-in user's own lykas_bookings docs (uid == auth.uid), used by
// MyBookingsPage. Booking *creation* happens in PaymentPage via
// bookingsService.createBookingWithPayment — this context is read-only.

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

const CustomerBookingsContext = createContext(null);

// Sorts newest-first client-side. A Firestore Timestamp has .toMillis();
// a doc whose createdAt hasn't resolved yet from serverTimestamp() reads
// as null on the local optimistic snapshot, so treat that as "now" so it
// sorts to the top immediately.
function sortByCreatedAtDesc(bookings) {
  return [...bookings].sort((a, b) => {
    const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : Infinity;
    const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : Infinity;
    return bTime - aTime;
  });
}

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

    // No orderBy here on purpose. where("uid","==") plus orderBy("createdAt")
    // on a different field needs a composite Firestore index. Sorting
    // client-side avoids that requirement, since each user only has a
    // small number of bookings.
    const q = query(
      collection(db, "lykas_bookings"),
      where("uid", "==", user.uid)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setBookings(sortByCreatedAtDesc(docs));
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
