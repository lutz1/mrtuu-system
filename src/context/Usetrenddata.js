import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAdminBookings } from "./AdminBookingsContext";

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// =========================================================
// GRANULARITY CONFIG — used by the per-chart Daily/Weekly/
// Monthly/Yearly dropdowns
// =========================================================

export const GRANULARITY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const GRANULARITY_CONFIG = {
  daily: { unit: "day", count: 14 },
  weekly: { unit: "week", count: 12 },
  monthly: { unit: "month", count: 12 },
  yearly: { unit: "year", count: 5 },
};

// =========================================================
// BUCKET HELPERS
// =========================================================

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d) {
  const x = startOfDay(d);
  x.setDate(x.getDate() - x.getDay()); // week starts Sunday
  return x;
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function startOfYear(d) {
  return new Date(d.getFullYear(), 0, 1);
}

function bucketStart(date, unit) {
  switch (unit) {
    case "week":
      return startOfWeek(date);
    case "month":
      return startOfMonth(date);
    case "year":
      return startOfYear(date);
    case "day":
    default:
      return startOfDay(date);
  }
}

function addBuckets(date, n, unit) {
  const d = new Date(date);
  switch (unit) {
    case "week":
      d.setDate(d.getDate() + n * 7);
      return d;
    case "month":
      d.setMonth(d.getMonth() + n);
      return d;
    case "year":
      d.setFullYear(d.getFullYear() + n);
      return d;
    case "day":
    default:
      d.setDate(d.getDate() + n);
      return d;
  }
}

function bucketLabel(date, unit) {
  switch (unit) {
    case "week":
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    case "month":
      return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    case "year":
      return String(date.getFullYear());
    case "day":
    default:
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

function buildBuckets(granularity) {
  const config = GRANULARITY_CONFIG[granularity] || GRANULARITY_CONFIG.daily;
  const { unit, count } = config;
  const now = new Date();
  return Array.from({ length: count }, (_, i) =>
    bucketStart(addBuckets(now, -(count - 1 - i), unit), unit)
  ).map((start, i, arr) => ({
    start,
    end: i + 1 < arr.length ? undefined : addBuckets(start, 1, unit), // filled below
    unit,
  }));
}

function bucketsWithEnds(granularity) {
  const buckets = buildBuckets(granularity);
  return buckets.map((b, i) => ({
    ...b,
    end: i + 1 < buckets.length ? buckets[i + 1].start : addBuckets(b.start, 1, b.unit),
  }));
}

// =========================================================
// REVENUE TREND
// =========================================================

export function useRevenueTrend(granularity = "daily") {
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
        console.error("Failed to load payments for trend:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const data = useMemo(() => {
    const buckets = bucketsWithEnds(granularity);
    const successfulPayments = payments.filter((p) => p.status === "successful");

    return buckets.map(({ start, end, unit }) => {
      const revenue = successfulPayments.reduce((sum, p) => {
        const created = toDate(p.createdAt);
        return created && created >= start && created < end
          ? sum + (p.amount || 0)
          : sum;
      }, 0);
      return { date: bucketLabel(start, unit), revenue };
    });
  }, [payments, granularity]);

  return { data, loading };
}

// =========================================================
// BOOKINGS TREND
// =========================================================

export function useBookingsTrend(granularity = "daily") {
  const { bookings, loading } = useAdminBookings();

  const data = useMemo(() => {
    const buckets = bucketsWithEnds(granularity);

    return buckets.map(({ start, end, unit }) => {
      const count = (bookings || []).reduce((sum, b) => {
        const created = toDate(b.createdAt);
        return created && created >= start && created < end ? sum + 1 : sum;
      }, 0);
      return { date: bucketLabel(start, unit), bookings: count };
    });
  }, [bookings, granularity]);

  return { data, loading };
}