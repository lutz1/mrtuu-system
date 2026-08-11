import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  submitBookingClearance,
  submitPreRentChecklist,
  submitPostRentChecklist,
  submitReturnReview,
  cancelBooking as cancelBookingService,
  flagBookingReturnRequested,
} from "../services/bookingsService";
import { useAuth } from "./AuthContext";
import { useStaff } from "./StaffContext";

const AdminBookingsContext = createContext(null);

export const BOOKING_STAGES = {
  QUEUE: "queue", // confirmed + cleared, waiting for dispatcher pickup
  ACTIVE: "active", // ongoing (vehicle out)
  HISTORY: "history", // completed or cancelled
};

// Derives a UI-friendly "stage" from the real status/clearance/dispatchChecklist
// fields, so existing table components (which expect b.stage) keep working
// without needing to understand the full state machine.
function deriveStage(booking) {
  if (booking.status === "completed" || booking.status === "cancelled") {
    return BOOKING_STAGES.HISTORY;
  }
  if (booking.status === "ongoing") {
    return BOOKING_STAGES.ACTIVE;
  }
  return BOOKING_STAGES.QUEUE; // pending / confirmed (pre- and post-clearance)
}

function formatDate(value) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value + "T00:00:00") : null;
  if (!d || Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function joinBooking(booking, vehiclesById) {
  const vehicle = vehiclesById.get(booking.vehicleId);
  return {
    ...booking,
    stage: deriveStage(booking),
    customer: booking.driver?.fullName || "—",
    phone: booking.driver?.phone || "—",
    vehicle: vehicle?.name || "Unknown Vehicle",
    plate: vehicle?.plate || "—",
    pickupTime: booking.pickupTime || "",
    returnTime: booking.returnTime || "",
    returnDateDisplay: formatDate(booking.returnDate),
    pickupDateDisplay: formatDate(booking.pickupDate),
    source: booking.source || (booking.uid ? "Online" : "Walk-in"),
  };
}

export function AdminBookingsProvider({ children }) {
  const { user } = useAuth();
  const { staffProfile } = useStaff();

  const [rawBookings, setRawBookings] = useState([]);
  const [vehiclesById, setVehiclesById] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "lykas_bookings"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setRawBookings(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load bookings:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "lykas_vehicles"),
      (snapshot) => {
        const map = new Map();
        snapshot.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));
        setVehiclesById(map);
      }
    );
    return unsubscribe;
  }, []);

  const bookings = useMemo(
    () => rawBookings.map((b) => joinBooking(b, vehiclesById)),
    [rawBookings, vehiclesById]
  );

  // Admin walk-in booking creation (AdminNewBookingPage). Walk-in customers
  // may not have a Firebase Auth account, so there's no `uid` here — this is
  // intentionally a separate, simpler path from the customer online-booking
  // flow in bookingsService.createBookingWithPayment.
  //
  // NOTE: unlike online bookings, walk-in documents are physically checked
  // by the admin in person while filling this form out — there's no
  // separate "review documents, then send to dispatcher" step for these.
  // clearance is therefore approved at creation time, so the booking is
  // immediately visible in the dispatcher's ready-for-pickup queue.
const addBooking = useCallback(
    async (bookingData) => {
      const currentAdminUid = staffProfile?.uid || user?.uid || null;

      const docRef = await addDoc(collection(db, "lykas_bookings"), {
        uid: null,
        vehicleId: bookingData.vehicleId,
        status: "confirmed",
        location: bookingData.location || "",
        pickupDate: bookingData.pickupDate || "",
        returnDate: bookingData.returnDate || "",
        pickupTime: bookingData.pickupTime || "",
        returnTime: bookingData.returnTime || "",
        days: bookingData.days || 1,
        dailyRate: bookingData.dailyRate || 0,
        total: bookingData.total || 0,
        driver: {
          fullName: bookingData.customer || "",
          phone: bookingData.phone || "",
          email: bookingData.email || "",
          licenseNo: bookingData.licenseNumber || "",
        },
        source: "Walk-in",
        paymentId: null,
        dispatchedBy: null,
        dispatchedAt: null,
        returnedAt: null,
        // Walk-in documents are verified in-person: auto-clear so it goes directly to dispatcher inspection queue
        clearance: {
          status: "cleared",
          checkedBy: currentAdminUid,
          checkedAt: serverTimestamp(),
          licenseVerified: true,
          notes: "Walk-in booking — documents verified in person by admin.",
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
      return { id: docRef.id, ...bookingData };
    },
    [user, staffProfile]
  );

  const getBookingById = useCallback(
    (id) => bookings.find((b) => b.id === id),
    [bookings]
  );

  const value = useMemo(
    () => ({
      bookings,
      loading,
      addBooking,
      getBookingById,
      // Lifecycle actions — thin wrappers over bookingsService so consumers
      // don't need to import both contexts.
      submitClearance: submitBookingClearance,
      dispatchPreRent: submitPreRentChecklist,
      dispatchPostRent: submitPostRentChecklist,
      reviewReturn: submitReturnReview,
      cancelBooking: cancelBookingService,
      flagReturnRequested: flagBookingReturnRequested,
    }),
    [bookings, loading, addBooking, getBookingById]
  );

  return (
    <AdminBookingsContext.Provider value={value}>
      {children}
    </AdminBookingsContext.Provider>
  );
}

export function useAdminBookings() {
  const context = useContext(AdminBookingsContext);
  if (!context) {
    throw new Error(
      "useAdminBookings must be used within an AdminBookingsProvider"
    );
  }
  return context;
}