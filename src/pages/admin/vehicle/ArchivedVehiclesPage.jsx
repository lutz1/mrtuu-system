import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../dashboard/AdminLayout";
import ArchivedVehicleFilterBar from "../../../components/admin/vehicle/archive/ArchivedVehicleFilterBar";
import ArchivedVehiclesTable from "../../../components/admin/vehicle/archive/ArchivedVehiclesTable";
import Pagination from "../../../components/admin/common/Pagination";
import { useAdminVehicles } from "../../../context/AdminVehiclesContext";
import { useToast } from "../../../context/ToastContext";
import styles from "./ArchivedVehiclesPage.module.css";

const PAGE_SIZE = 6;

export default function ArchivedVehiclesPage() {
  const { archivedVehicles, restoreVehicle } = useAdminVehicles();
  const { showToast } = useToast();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [type, setType] = useState("All Types");
  const [transmission, setTransmission] = useState("Transmission");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return archivedVehicles.filter((v) => {
      const matchesQuery = q === "" || v.name.toLowerCase().includes(q) || v.plate.toLowerCase().includes(q);
      const matchesStatus = status === "All Status" || v.status === status;
      const matchesType = type === "All Types" || v.type === type;
      const matchesTransmission = transmission === "Transmission" || v.transmission === transmission;
      return matchesQuery && matchesStatus && matchesType && matchesTransmission;
    });
  }, [archivedVehicles, query, status, type, transmission]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const makeFilterHandler = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleRestore = (vehicle) => {
    restoreVehicle(vehicle.id);
    showToast(`${vehicle.name} restored to the active showroom.`, { type: "success" });
  };

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Archived Vehicles</h1>
        <p className={styles.breadcrumb}>
          <Link to="/admin/vehicles" className={styles.breadcrumbLink}>
            Vehicles
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span>Archived Vehicles</span>
        </p>
      </div>

      <div className={styles.infoCard}>
        <h2 className={styles.infoTitle}>About Archived Vehicles</h2>
        <p className={styles.infoText}>
          Archived vehicles are hidden from the active showroom and cannot be booked. You can restore a vehicle at
          any time if needed.
        </p>
      </div>

      <div className={styles.filterWrap}>
        <ArchivedVehicleFilterBar
          query={query}
          onQueryChange={makeFilterHandler(setQuery)}
          status={status}
          onStatusChange={makeFilterHandler(setStatus)}
          type={type}
          onTypeChange={makeFilterHandler(setType)}
          transmission={transmission}
          onTransmissionChange={makeFilterHandler(setTransmission)}
        />
      </div>

      <ArchivedVehiclesTable vehicles={pageItems} onRestore={handleRestore} />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="archived vehicles"
      />
    </AdminLayout>
  );
}