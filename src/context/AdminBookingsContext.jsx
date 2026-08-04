import { createContext, useContext, useState } from "react";
import { MOCK_BOOKINGS, BOOKING_STAGES } from "../data/admin/mockBookings";

// TODO: TEMPORARY. Holds bookings in memory only — resets on page
// refresh. Replace with real Firestore reads/writes once the admin data
// layer exists; the addBooking shape here should carry over.
const AdminBookingsContext = createContext(null);

function generateBookingId(bookings) {
  const maxNum = bookings.reduce((max, b) => {
    const match = b.id.match(/#BK-(\d+)/);
    const num = match ? parseInt(match[1], 10) : 0;
    return Math.max(max, num);
  }, 0);
  return `#BK-${maxNum + 1}`;
}

export function AdminBookingsProvider({ children }) {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: generateBookingId(bookings),
      stage: BOOKING_STAGES.QUEUE,
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const value = { bookings, addBooking };

  return <AdminBookingsContext.Provider value={value}>{children}</AdminBookingsContext.Provider>;
}

export function useAdminBookings() {
  const context = useContext(AdminBookingsContext);
  if (!context) {
    throw new Error("useAdminBookings must be used within an AdminBookingsProvider");
  }
  return context;
}