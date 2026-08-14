import { useNavigate } from "react-router-dom";
import DispatcherLayout from "../DispatcherLayout";
import DispatcherStatCard from "../../../components/dispatcher/dashboard/DispatcherStatCard";
import InspectionQueueTable from "../../../components/dispatcher/inspection/InspectionQueueTable";
import RemindersCard from "../../../components/dispatcher/dashboard/RemindersCard";
import UpcomingPickupsCard from "../../../components/dispatcher/dashboard/UpcomingPickupsCard";
import {
  useAdminBookings,
  BOOKING_STAGES,
} from "../../../context/AdminBookingsContext";
import styles from "./DispatcherDashboardPage.module.css";

function InspectionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.5 14l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompletedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 3v3.5M16 3v3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="4"
        y="4"
        width="14"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="17.5"
        cy="17.5"
        r="4.5"
        fill="#ffffff"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M17.5 15.5v2l1.3 1.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClearedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DispatcherDashboardPage() {
  const navigate = useNavigate();
  const { bookings } = useAdminBookings();

  // Dispatcher's "For Inspection" queue = cleared bookings still waiting for
  // the pre-rent checklist (dispatchChecklist.preRent not yet submitted).
  const pickupBookings = bookings.filter(
    (b) =>
      b.stage === BOOKING_STAGES.QUEUE &&
      b.clearance?.status === "cleared" &&
      !b.dispatchChecklist?.preRent
  );
  const previewBookings = pickupBookings.slice(0, 5);
  const upcomingPickups = pickupBookings.slice(0, 2);

  const handleStartInspection = (booking) => {
    navigate(`/dispatcher/inspection/${encodeURIComponent(booking.id)}`);
  };

  return (
    <DispatcherLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Good morning, Selsite!</h1>
        <p className={styles.subtitle}>Here's your overview for today.</p>
      </div>

      <div className={styles.statsGrid}>
        <DispatcherStatCard
          icon={<InspectionIcon />}
          label="For Inspection"
          value={pickupBookings.length}
          footnote="Bookings waiting for inspection"
        />
        {/* NOTE: these three still need real aggregate queries (completed
            today / awaiting_return_review count / cleared this month) —
            left as placeholders since they need date-range queries not
            wired yet. */}
        <DispatcherStatCard
          icon={<CompletedIcon />}
          label="Completed Today"
          value="—"
          footnote="Inspection completed today"
        />
        <DispatcherStatCard
          icon={<PendingIcon />}
          label="Completed This Week"
          value={
            bookings.filter((b) => {
              if (b.status !== "completed" || !b.returnedAt) return false;
              const d = b.returnedAt.toDate
                ? b.returnedAt.toDate()
                : new Date(b.returnedAt);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return d >= weekAgo;
            }).length
          }
          footnote="Returns processed in the last 7 days"
        />
        <DispatcherStatCard
          icon={<ClearedIcon />}
          label="Total Cleared"
          value="—"
          footnote="This Month"
        />
      </div>

      <div className={styles.mainGrid}>
        <section className={styles.forInspectionCard}>
          <div className={styles.forInspectionHeader}>
            <h2 className={styles.forInspectionTitle}>
              For Inspection ({pickupBookings.length})
            </h2>
            <button
              type="button"
              className={styles.viewAllBtn}
              onClick={() => navigate("/dispatcher/inspection")}
            >
              View all
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <InspectionQueueTable
            bookings={previewBookings}
            onStartInspection={handleStartInspection}
          />

          <p className={styles.showingText}>
            Showing 1 to {previewBookings.length} of {pickupBookings.length}{" "}
            entries
          </p>
        </section>

        <div className={styles.sidebarCol}>
          <RemindersCard />
          <UpcomingPickupsCard
            pickups={upcomingPickups}
            onViewAll={() => navigate("/dispatcher/inspection")}
          />
        </div>
      </div>
    </DispatcherLayout>
  );
}
