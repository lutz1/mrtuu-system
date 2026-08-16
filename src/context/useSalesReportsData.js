import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAdminBookings } from "./AdminBookingsContext";
import { useCustomers } from "./CustomersContext";

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const PERIOD_OPTIONS = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
];

const PERIOD_CONFIG = {
  "7d": { label: "Last 7 Days", comparisonLabel: "vs prior 7 days", days: 7 },
  "30d": {
    label: "Last 30 Days",
    comparisonLabel: "vs prior 30 days",
    days: 30,
  },
};

const STATUS_COLORS = {
  confirmed: "#3b82f6",
  ongoing: "#e8a020",
  completed: "#22a35e",
  cancelled: "#9ca3af",
};
const STATUS_LABELS = {
  confirmed: "Confirmed",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function useSalesReportsData(period = "7d") {
  const { bookings } = useAdminBookings();
  const { customers } = useCustomers();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "lykas_payments"),
      (snapshot) => {
        setPayments(snapshot.docs.map((d) => d.data()));
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load payments:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return useMemo(() => {
    const config = PERIOD_CONFIG[period] || PERIOD_CONFIG["7d"];
    const days = config.days;

    const successfulPayments = payments.filter(
      (p) => p.status === "successful"
    );

    const periodStart = daysAgo(days - 1);
    const priorStart = daysAgo(days * 2 - 1);
    const priorEnd = periodStart;

    const sumRevenueBetween = (start, end) =>
      successfulPayments.reduce((sum, p) => {
        const created = toDate(p.createdAt);
        if (created && created >= start && (!end || created < end))
          return sum + (p.amount || 0);
        return sum;
      }, 0);

    const countBookingsBetween = (start, end) =>
      bookings.reduce((sum, b) => {
        const created = toDate(b.createdAt);
        if (created && created >= start && (!end || created < end))
          return sum + 1;
        return sum;
      }, 0);

    const currentRevenue = sumRevenueBetween(periodStart);
    const priorRevenue = sumRevenueBetween(priorStart, priorEnd);
    const currentBookingsCount = countBookingsBetween(periodStart);
    const priorBookingsCount = countBookingsBetween(priorStart, priorEnd);

    const carsRented = bookings.filter(
      (b) => b.status === "ongoing" || b.status === "completed"
    ).length;

    const newCustomers = customers.filter((c) => {
      const d = c.joinedAt?.toDate
        ? c.joinedAt.toDate()
        : c.joinedAt
        ? new Date(c.joinedAt)
        : null;
      return d && d >= periodStart;
    }).length;

    const avgDailyRevenue = Math.round(currentRevenue / days);

    function pctChange(current, prior) {
      if (!prior) return current > 0 ? "+100%" : "0%";
      const pct = ((current - prior) / prior) * 100;
      return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
    }

    const overviewStats = [
      {
        key: "revenue",
        label: "Total Revenue",
        value: `₱${currentRevenue.toLocaleString()}`,
        change: pctChange(currentRevenue, priorRevenue),
        direction: currentRevenue >= priorRevenue ? "up" : "down",
      },
      {
        key: "bookings",
        label: "Total Bookings",
        value: String(currentBookingsCount),
        change: pctChange(currentBookingsCount, priorBookingsCount),
        direction: currentBookingsCount >= priorBookingsCount ? "up" : "down",
      },
      {
        key: "carsRented",
        label: "Cars Rented",
        value: String(carsRented),
        change: "—",
        direction: "up",
      },
      {
        key: "newCustomers",
        label: "New Customers",
        value: String(newCustomers),
        change: "—",
        direction: "up",
      },
      {
        key: "avgDailyRevenue",
        label: "Avg Daily Revenue",
        value: `₱${avgDailyRevenue.toLocaleString()}`,
        change: "—",
        direction: "up",
      },
    ];

    // Revenue by vehicle (all-time top vehicles)
    const revenueByVehicleMap = new Map();
    bookings.forEach((b) => {
      if (b.status !== "completed" && b.status !== "ongoing") return;
      const key = b.vehicle || "Unknown Vehicle";
      const entry = revenueByVehicleMap.get(key) || {
        vehicle: key,
        bookings: 0,
        revenue: 0,
      };
      entry.bookings += 1;
      entry.revenue += b.total || 0;
      revenueByVehicleMap.set(key, entry);
    });
    const revenueByVehicle = [...revenueByVehicleMap.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);

    // Booking status breakdown
    const statusCounts = {};
    bookings.forEach((b) => {
      statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
    });
    const bookingStatusBreakdown = Object.entries(statusCounts).map(
      ([status, count]) => ({
        label: STATUS_LABELS[status] || status,
        count,
        color: STATUS_COLORS[status] || "#9ca3af",
      })
    );
    const totalBookings = bookings.length;

    return {
      loading,
      period,
      periodLabel: config.label,
      comparisonLabel: config.comparisonLabel,
      overviewStats,
      revenueByVehicle,
      bookingStatusBreakdown,
      totalBookings,
    };
  }, [bookings, customers, payments, loading, period]);
}