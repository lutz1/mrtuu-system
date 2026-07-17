import React from "react";
import Navbar from "../../components/frontpage/Navbar";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/frontpage/Footer";
import AccountSidebar from "../../components/AccountNav/AccountSidebar";
import BookingCard from "../../components/BookingCard/BookingCard";
import { BOOKINGS } from "../../data/bookings";
import styles from "./MyBookingsPage.module.css";

export default function MyBookingsPage() {
  const handleExtendTrip = (booking) => {
    // TODO: wire up extend-trip flow
    console.log("Extend trip:", booking.id);
  };

  const handleSupport = (booking) => {
    // TODO: open support/contact flow
    console.log("Support:", booking.id);
  };

  const handleDownloadInvoice = (booking) => {
    // TODO: generate/download invoice PDF
    console.log("Download invoice:", booking.id);
  };

  const handleRentAgain = (booking) => {
    // TODO: navigate to booking flow pre-filled with this car
    console.log("Rent again:", booking.id);
  };

  const handleViewDetails = (booking) => {
    // TODO: open booking details modal/page
    console.log("View details:", booking.id);
  };

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