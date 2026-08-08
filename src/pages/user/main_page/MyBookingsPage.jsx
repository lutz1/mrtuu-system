import Navbar from "../../../components/user/frontpage/Navbar";
import Breadcrumb from "../../../components/user/Breadcrumb";
import Footer from "../../../components/user/frontpage/Footer";
import AccountSidebar from "../../../components/user/account/AccountSidebar";
import BookingCard from "../../../components/user/booking/BookingCard";
import { useCustomerBookings } from "../../../context/CustomerBookingsContext";
import { useVehicles } from "../../../context/VehiclesContext";
import styles from "./MyBookingsPage.module.css";

// TODO: wire up extend-trip flow
const handleExtendTrip = (booking) => {
  console.log("Extend trip:", booking.id);
};

// TODO: open support/contact flow
const handleSupport = (booking) => {
  console.log("Support:", booking.id);
};

// TODO: generate/download invoice PDF
const handleDownloadInvoice = (booking) => {
  console.log("Download invoice:", booking.id);
};

// TODO: navigate to booking flow pre-filled with this car
const handleRentAgain = (booking) => {
  console.log("Rent again:", booking.id);
};

// TODO: open booking details modal/page
const handleViewDetails = (booking) => {
  console.log("View details:", booking.id);
};

// lykas_bookings docs store vehicleId + a status enum ("pending" | "confirmed" |
// "ongoing" | "completed" | "cancelled"); BookingCard expects a display-ready
// shape closer to the old mock (car name/image/status label). This maps one
// to the other so BookingCard doesn't need to change.
const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

function toCardBooking(booking, getVehicleById) {
  const vehicle = getVehicleById(booking.vehicleId);
  return {
    ...booking,
    carName: vehicle?.name ?? "Vehicle",
    carImage: vehicle?.images?.[0],
    statusLabel: STATUS_LABELS[booking.status] || booking.status,
  };
}

export default function MyBookingsPage() {
  const { bookings, loading } = useCustomerBookings();
  const { getVehicleById } = useVehicles();

  const cardBookings = bookings.map((b) => toCardBooking(b, getVehicleById));

  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <Navbar />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.contentWrapper}>
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Showroom", to: "/showroom" },
              { label: "Profile" },
            ]}
          />

          <div className={styles.layout}>
            <AccountSidebar
              activeSection="bookings"
              onSectionChange={() => {}}
              onDeleteAccount={() => {}}
            />

            <main className={styles.main}>
              <h1 className={styles.pageTitle}>My Bookings</h1>

              {loading ? (
                <div className={styles.emptyState}>
                  <p>Loading your bookings...</p>
                </div>
              ) : cardBookings.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>You haven't made any bookings yet.</p>
                </div>
              ) : (
                <div className={styles.bookingsList}>
                  {cardBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onExtendTrip={handleExtendTrip}
                      onSupport={handleSupport}
                      onDownloadInvoice={handleDownloadInvoice}
                      onRentAgain={handleRentAgain}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
