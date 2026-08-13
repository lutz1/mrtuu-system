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

// 1. Move BOOKING_STAGES to the top before using it in mock data
export const BOOKING_STAGES = {
  QUEUE: "queue", // confirmed + cleared, waiting for dispatcher pickup
  ACTIVE: "active", // ongoing (vehicle out)
  HISTORY: "history", // completed or cancelled
};

// 2. Mock Data for testing Booking History Tab
const MOCK_HISTORY_BOOKINGS = [
  {
    id: "BK-HIST-001",
    stage: BOOKING_STAGES.HISTORY,
    status: "completed",
    customer: "Jane Doe",
    phone: "+63 917 123 4567",
    vehicle: "Toyota Fortuner 2023",
    plate: "ABC-1234",
    vehicleTransmission: "Automatic",
    vehicleFuelType: "Diesel",
    source: "Online",
    createdAt: "2026-08-01T10:00:00Z",
    returnedAt: "2026-08-05T16:00:00Z",
    pickupDateDisplay: "August 1, 2026",
    pickupTime: "10:00 AM",
    returnDateDisplay: "August 5, 2026",
    returnTime: "04:00 PM",
    days: 4,
    dailyRate: 3500,
    total: 14800,
    addons: {
      gps: 500,
      childSeat: 300,
    },
    driver: {
      fullName: "Jane Doe",
      phone: "+63 917 123 4567",
      email: "jane.doe@example.com",
      licenseNo: "N01-12-345678",
    },
    clearance: {
      checkedAt: "2026-08-01T09:30:00Z",
    },
    dispatchChecklist: {
      preRent: {
        odometerReading: 12400,
        submittedAt: "2026-08-01T10:15:00Z",
      },
      postRent: {
        odometerReading: 12850,
        submittedAt: "2026-08-05T15:45:00Z",
      },
    },
  },
  {
    id: "BK-HIST-002",
    stage: BOOKING_STAGES.HISTORY,
    status: "cancelled",
    customer: "John Smith",
    phone: "+63 918 987 6543",
    vehicle: "Mitsubishi Montero Sport 2022",
    plate: "XYZ-5678",
    vehicleTransmission: "Automatic",
    vehicleFuelType: "Diesel",
    source: "Walk-in",
    createdAt: "2026-08-03T11:00:00Z",
    pickupDateDisplay: "August 4, 2026",
    pickupTime: "09:00 AM",
    returnDateDisplay: "August 6, 2026",
    returnTime: "09:00 AM",
    days: 2,
    dailyRate: 3200,
    total: 6400,
    driver: {
      fullName: "John Smith",
      phone: "+63 918 987 6543",
      email: "john.smith@example.com",
    },
  },
];

const AdminBookingsContext = createContext(null);

// Derives a UI-friendly "stage" from the real status/clearance/dispatchChecklist
function deriveStage(booking) {
  if (booking.status === "completed" || booking.status === "cancelled") {
    return BOOKING_STAGES.HISTORY;
  }
  if (booking.status === "ongoing") {
    return BOOKING_STAGES.ACTIVE;
  }
  return BOOKING_STAGES.QUEUE;
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

  const bookings = useMemo(() => {
    const realBookings = rawBookings.map((b) => joinBooking(b, vehiclesById));
    return [...realBookings, ...MOCK_HISTORY_BOOKINGS];
  }, [rawBookings, vehiclesById]);

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