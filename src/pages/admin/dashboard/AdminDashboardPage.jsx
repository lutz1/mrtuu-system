import React from "react";
import AdminLayout from "./AdminLayout";
import AdminStatCard from "../../../components/admin/dashboard/AdminStatCard";
import SalesProgressChart from "../../../components/admin/dashboard/SalesProgressChart";
import BookingsOverviewChart from "../../../components/admin/dashboard/BookingsOverviewChart";
import RecentBookingsCard from "../../../components/admin/dashboard/RecentBookingsCard";
import ChecklistReviewTable from "../../../components/admin/dashboard/ChecklistReviewTable";
import styles from "./AdminDashboardPage.module.css";

function BookingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8.5h8M8 12.5h8M8 16.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SalesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20V10M10.5 20V4M17 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12.5l2.3 2.3L16 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VehiclesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 15l1.5-5A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="15" width="18" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CustomersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.5 11.5l1.3 1.3L13.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Overview of your car rental services</p>
      </div>

      <div className={styles.statsGrid}>
        <AdminStatCard icon={<BookingsIcon />} label="Total Bookings" value="48" footnote="+12 from last week" />
        <AdminStatCard icon={<SalesIcon />} label="Total Sales" value="₱72,350" footnote="+18% from last week" />
        <AdminStatCard icon={<ChecklistIcon />} label="Pending Checklist" value="12" footnote="View and process" />
        <AdminStatCard icon={<VehiclesIcon />} label="Available Vehicles" value="26" footnote="Total in showroom" />
        <AdminStatCard icon={<CustomersIcon />} label="Active Customers" value="156" footnote="Total registered" />
      </div>

      <div className={styles.mainGrid}>
        <SalesProgressChart />
        <BookingsOverviewChart />
        <RecentBookingsCard />
      </div>

      <ChecklistReviewTable />
    </AdminLayout>
  );
}