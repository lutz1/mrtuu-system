import React, { useState } from "react";
import AdminLayout from "../dashboard/AdminLayout";
import ReportTabs from "../../../components/admin/salesReports/ReportTabs";
import ReportToolbar from "../../../components/admin/salesReports/ReportToolbar";
import ReportStatCard from "../../../components/admin/salesReports/ReportStatCard";
import RevenueTrendChart from "../../../components/admin/salesReports/RevenueTrendChart";
import BookingsVolumeChart from "../../../components/admin/salesReports/BookingsVolumeChart";
import RevenueByVehicleTable from "../../../components/admin/salesReports/RevenueByVehicleTable";
import BookingStatusDonut from "../../../components/admin/salesReports/BookingStatusDonut";
import RecentReportsCard from "../../../components/admin/salesReports/RecentReportsCard";
import {
  REPORT_PERIOD_LABEL,
  COMPARISON_LABEL,
  OVERVIEW_STATS,
  REVENUE_TREND,
  BOOKINGS_TREND,
  REVENUE_BY_VEHICLE,
  BOOKING_STATUS_BREAKDOWN,
  TOTAL_BOOKINGS,
  RECENT_REPORTS,
} from "../../../data/admin/mockSalesReports";
import styles from "./AdminSalesReportsPage.module.css";

function RevenueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20V10M10.5 20V4M17 20v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function BookingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8.5h8M8 12.5h8M8 16.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CarsRentedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 15l1.5-5A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="15" width="18" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.5 6.5h3l1 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NewCustomersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 19c1-3.6 3.2-5.3 5.5-5.3s4.5 1.7 5.5 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.5 12l1.4 1.4 2.6-2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AvgRevenueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5v9M9.5 9.8c0-1.1 1.1-1.8 2.5-1.8s2.5.7 2.5 1.7c0 2.4-5 1.1-5 3.5 0 1 1.1 1.7 2.5 1.7s2.5-.7 2.5-1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const STAT_ICONS = {
  revenue: <RevenueIcon />,
  bookings: <BookingsIcon />,
  carsRented: <CarsRentedIcon />,
  newCustomers: <NewCustomersIcon />,
  avgDailyRevenue: <AvgRevenueIcon />,
};

export default function AdminSalesReportsPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  // TODO: wire to real export (CSV/PDF) once available
  const handleExport = () => {
    console.log(`Export "${activeTab}" for period: ${REPORT_PERIOD_LABEL}`);
  };

  // TODO: wire to a real file download once report generation exists
  const handleDownloadReport = (report) => {
    console.log("Download report:", report.name);
  };

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Sales &amp; Reports</h1>
      </div>

      <div className={styles.toolbar}>
        <ReportTabs active={activeTab} onChange={setActiveTab} />
        <ReportToolbar periodLabel={REPORT_PERIOD_LABEL} onExport={handleExport} />
      </div>

      {activeTab === "Overview" ? (
        <>
          <div className={styles.statsGrid}>
            {OVERVIEW_STATS.map((stat) => (
              <ReportStatCard
                key={stat.key}
                icon={STAT_ICONS[stat.key]}
                label={stat.label}
                value={stat.value}
                change={stat.change}
                direction={stat.direction}
                comparisonLabel={COMPARISON_LABEL}
              />
            ))}
          </div>

          <div className={styles.chartsGrid}>
            <RevenueTrendChart data={REVENUE_TREND} />
            <BookingsVolumeChart data={BOOKINGS_TREND} />
          </div>

          <div className={styles.bottomGrid}>
            <RevenueByVehicleTable rows={REVENUE_BY_VEHICLE} />
            <BookingStatusDonut data={BOOKING_STATUS_BREAKDOWN} total={TOTAL_BOOKINGS} />
            <RecentReportsCard reports={RECENT_REPORTS} onDownload={handleDownloadReport} />
          </div>
        </>
      ) : (
        <div className={styles.placeholder}>
          <p className={styles.placeholderTitle}>{activeTab} is not built yet</p>
          <p className={styles.placeholderText}>
            This tab will show a dedicated {activeTab.toLowerCase()} once it's designed.
          </p>
        </div>
      )}
    </AdminLayout>
  );
}