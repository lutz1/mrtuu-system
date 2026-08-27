import { useMemo, useState } from "react";
import VehicleSelectCard from "./VehicleSelectCard";
import Pagination from "../../common/Pagination";
import { useAdminVehicles } from "../../../../context/AdminVehiclesContext";
import { VEHICLE_TYPES, SEAT_OPTIONS } from "../../../../data/admin/mockVehicles";
import styles from "./VehicleSelectionStep.module.css";

const PAGE_SIZE = 8;

export default function VehicleSelectionStep({ onSelectVehicle }) {
  const { vehicles } = useAdminVehicles();
  const [query, setQuery] = useState("");
  const [transmission, setTransmission] = useState("All Transmissions");
  const [type, setType] = useState("All Types");
  const [seats, setSeats] = useState("All Seats");
  const [page, setPage] = useState(1);

  // Only vehicles that are actually bookable right now.
  const availableVehicles = useMemo(() => vehicles.filter((v) => v.status === "Available"), [vehicles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return availableVehicles.filter((v) => {
      const matchesQuery = q === "" || v.name.toLowerCase().includes(q) || v.plate.toLowerCase().includes(q);
      const matchesTransmission = transmission === "All Transmissions" || v.transmission === transmission;
      const matchesType = type === "All Types" || v.type === type;
      const matchesSeats = seats === "All Seats" || String(v.seats) === seats;
      return matchesQuery && matchesTransmission && matchesType && matchesSeats;
    });
  }, [availableVehicles, query, transmission, type, seats]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(1);
  };
  const handleTransmissionChange = (value) => {
    setTransmission(value);
    setPage(1);
  };
  const handleTypeChange = (value) => {
    setType(value);
    setPage(1);
  };
  const handleSeatsChange = (value) => {
    setSeats(value);
    setPage(1);
  };

  return (
    <div>
      <h2 className={styles.sectionTitle}>Available Vehicles</h2>

      <div className={styles.filterRow}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search vehicles (name, brand, plate no.)"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>

        <select className={styles.select} value={transmission} onChange={(e) => handleTransmissionChange(e.target.value)}>
          <option>All Transmissions</option>
          <option>Automatic</option>
          <option>Manual</option>
        </select>

        <select className={styles.select} value={type} onChange={(e) => handleTypeChange(e.target.value)}>
          <option>All Types</option>
          {VEHICLE_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <select className={styles.select} value={seats} onChange={(e) => handleSeatsChange(e.target.value)}>
          <option>All Seats</option>
          {SEAT_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} Seats
            </option>
          ))}
        </select>
      </div>

      {pageItems.length === 0 ? (
        <div className={styles.empty}>No available vehicles match your search or filters.</div>
      ) : (
        <div className={styles.grid}>
          {pageItems.map((vehicle) => (
            <VehicleSelectCard key={vehicle.id} vehicle={vehicle} onSelect={() => onSelectVehicle(vehicle)} />
          ))}
        </div>
      )}

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="vehicles"
      />
    </div>
  );
}