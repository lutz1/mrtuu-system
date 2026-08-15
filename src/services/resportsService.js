// src/services/reportsService.js
//
// Generates and stores sales/booking reports as CSV files. No Cloud
// Functions infra exists in this project, so report generation runs
// entirely client-side: build a CSV string from data the caller already
// computed (via useSalesReportsData), upload it to Storage, then write a
// lykas_reports/{id} doc so RecentReportsCard can list it in real time.

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";

const REPORTS = "lykas_reports";

function csvEscape(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowsToCsv(rows) {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

/**
 * Builds a CSV string for the given report tab from already-computed
 * report data (the same shape useSalesReportsData returns).
 */
export function buildReportCsv(tabName, data) {
  const sections = [];

  sections.push(["Report", tabName]);
  sections.push(["Generated At", new Date().toLocaleString("en-US")]);
  sections.push([]);

  sections.push(["Overview Stats"]);
  sections.push(["Label", "Value", "Change", "Direction"]);
  data.overviewStats.forEach((s) => {
    sections.push([s.label, s.value, s.change, s.direction]);
  });
  sections.push([]);

  sections.push(["Revenue Trend"]);
  sections.push(["Date", "Revenue (PHP)"]);
  data.revenueTrend.forEach((r) => sections.push([r.date, r.revenue]));
  sections.push([]);

  sections.push(["Bookings Trend"]);
  sections.push(["Date", "Bookings"]);
  data.bookingsTrend.forEach((r) => sections.push([r.date, r.bookings]));
  sections.push([]);

  sections.push(["Revenue By Vehicle"]);
  sections.push(["Vehicle", "Bookings", "Revenue (PHP)"]);
  data.revenueByVehicle.forEach((r) =>
    sections.push([r.vehicle, r.bookings, r.revenue])
  );
  sections.push([]);

  sections.push(["Booking Status Breakdown"]);
  sections.push(["Status", "Count"]);
  data.bookingStatusBreakdown.forEach((r) => sections.push([r.label, r.count]));
  sections.push(["Total Bookings", data.totalBookings]);

  return rowsToCsv(sections);
}

/**
 * Generates a CSV report, uploads it to Storage, and writes a
 * lykas_reports/{id} record. Returns the created report record.
 */
export async function generateAndSaveReport({
  tabName,
  data,
  staffUid,
  periodLabel,
}) {
  const csv = buildReportCsv(tabName, data);
  const timestamp = Date.now();
  const safeTab = tabName.replace(/\s+/g, "_");
  const fileName = `${safeTab}_${timestamp}.csv`;
  const storageRef = ref(storage, `reports/${fileName}`);

  await uploadString(storageRef, csv, "raw", { contentType: "text/csv" });
  const downloadUrl = await getDownloadURL(storageRef);

  const reportDoc = await addDoc(collection(db, REPORTS), {
    name: `${tabName} Report — ${periodLabel}`,
    tab: tabName,
    periodLabel,
    fileName,
    downloadUrl,
    generatedBy: staffUid || null,
    generatedAt: serverTimestamp(),
  });

  return { id: reportDoc.id, fileName, downloadUrl };
}
