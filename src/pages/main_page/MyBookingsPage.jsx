import React from "react";
import Navbar from "../../components/frontpage/Navbar";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/frontpage/Footer";
import AccountSidebar from "../../components/account/AccountSidebar";
import BookingCard from "../../components/booking/BookingCard";
import { BOOKINGS } from "../../data/bookings";
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

export default function MyBookingsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <Navbar />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.contentWrapper}>
          <Breadcrumb
            items={[{ label: "Home", to: "/" }, { label: "Showroom", to: "/showroom" }, { label: "Profile" }]}
          />

          <div className={styles.layout}>
            <AccountSidebar activeSection="bookings" onSectionChange={() => {}} onDeleteAccount={() => {}} />

            <main className={styles.main}>
              <h1 className={styles.pageTitle}>My Bookings</h1>

              {BOOKINGS.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>You haven't made any bookings yet.</p>
                </div>
              ) : (
                <div className={styles.bookingsList}>
                  {BOOKINGS.map((booking) => (
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