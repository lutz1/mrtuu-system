import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../dashboard/AdminLayout";
import VehicleStatCard from "../../../components/admin/vehicle/VehicleStatCard";
import VehicleFilterBar from "../../../components/admin/vehicle/VehicleFilterBar";
import VehicleCard from "../../../components/admin/vehicle/VehicleCard";
import VehicleViewOverlay from "../../../components/admin/vehicle/VehicleViewOverlay";
import AddVehicleModal from "../../../components/admin/vehicle/addVehicle/AddVehicleModal";
import Pagination from "../../../components/admin/common/Pagination";
import { useAdminVehicles } from "../../../context/AdminVehiclesContext";
import styles from "./AdminVehiclesPage.module.css";

const PAGE_SIZE = 8;

function TotalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 15l1.5-5A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="15" width="18" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.5" cy="19.5" r="1.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16.5" cy="19.5" r="1.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function AvailableIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4.5" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9.5l2.3 2.3L16 6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OnRentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MaintenanceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.5 6.5a3.5 3.5 0 0 1-4.6 4.6L5 16l-1 3 3-1 4.9-4.9a3.5 3.5 0 0 1 4.6-4.6L14 11l2.5-2.5L14.5 6.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UnavailableIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 6.5l11 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminVehiclesPage() {
  const navigate = useNavigate();
  const { vehicles } = useAdminVehicles();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [type, setType] = useState("All Types");
  const [transmission, setTransmission] = useState("Transmission");
  const [page, setPage] = useState(1);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredVehicles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      const matchesQuery = q === "" || v.name.toLowerCase().includes(q) || v.plate.toLowerCase().includes(q);
      const matchesStatus = status === "All Status" || v.status === status;
      const matchesType = type === "All Types" || v.type === type;
      const matchesTransmission = transmission === "Transmission" || v.transmission === transmission;
      return matchesQuery && matchesStatus && matchesType && matchesTransmission;
    });
  }, [vehicles, query, status, type, transmission]);

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredVehicles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const makeFilterHandler = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleEdit = (vehicle) => {
    navigate(`/admin/vehicles/${vehicle.id}/edit`);
  };

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Vehicle Showroom</h1>
        <p className={styles.subtitle}>Overview of your car rental services</p>
      </div>

      <div className={styles.statsGrid}>
        <VehicleStatCard icon={<TotalIcon />} label="Total Vehicles" value="48" />
        <VehicleStatCard icon={<AvailableIcon />} label="Available" value="25" />
        <VehicleStatCard icon={<OnRentIcon />} label="On Rent" value="8" />
        <VehicleStatCard icon={<MaintenanceIcon />} label="Under Maintenance" value="3" />
        <VehicleStatCard icon={<UnavailableIcon />} label="Unavailable" value="0" />
      </div>

      <div className={styles.filterWrap}>
        <VehicleFilterBar
          query={query}
          onQueryChange={makeFilterHandler(setQuery)}
          status={status}
          onStatusChange={makeFilterHandler(setStatus)}
          type={type}
          onTypeChange={makeFilterHandler(setType)}
          transmission={transmission}
          onTransmissionChange={makeFilterHandler(setTransmission)}
          onAddVehicle={() => setIsAddModalOpen(true)}
        />
      </div>

      {pageItems.length === 0 ? (
        <div className={styles.empty}>No vehicles match your search or filters.</div>
      ) : (
        <div className={styles.grid}>
          {pageItems.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onView={setViewingVehicle} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filteredVehicles.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="vehicles"
      />

      {viewingVehicle && (
        <VehicleViewOverlay
          vehicle={viewingVehicle}
          onClose={() => setViewingVehicle(null)}
          onEdit={(vehicle) => {
            setViewingVehicle(null);
            handleEdit(vehicle);
          }}
        />
      )}

      {isAddModalOpen && <AddVehicleModal onClose={() => setIsAddModalOpen(false)} />}
    </AdminLayout>
  );
}