import React from "react";
import styles from "./VehicleStatusBadge.module.css";

const STATUS_CLASS = {
  Available: "statusAvailable",
  "On Rent": "statusOnRent",
  "Under Maintenance": "statusMaintenance",
  Unavailable: "statusUnavailable",
};

export default function VehicleStatusBadge({ status }) {
  const className = STATUS_CLASS[status] || "statusUnavailable";
  return <span className={`${styles.badge} ${styles[className]}`}>{status}</span>;
}