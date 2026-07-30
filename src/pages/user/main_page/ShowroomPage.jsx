import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../../components/user/frontpage/Navbar";
import SearchFilterBar from "../../../components/user/SearchFilterBar";
import Breadcrumb from "../../../components/user/Breadcrumb";
import CarGrid from "../../../components/user/carcards/CarGrid";
import Footer from "../../../components/user/frontpage/Footer";
import styles from "./ShowroomPage.module.css";
import { useVehicles } from "../../../context/VehiclesContext";

export default function ShowroomPage() {
  const [searchParams] = useSearchParams();
  const { vehicles } = useVehicles();

  const [filters, setFilters] = useState({
    query: searchParams.get("q") ?? "",
    transmission: searchParams.get("transmission") ?? "All",
    fuelType: searchParams.get("fuelType") ?? "All",
    carType: searchParams.get("carType") ?? "All",
    brand: searchParams.get("brand") ?? "All",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredCars = vehicles.filter((car) => {
    const matchesQuery = car.name
      .toLowerCase()
      .includes(filters.query.trim().toLowerCase());
    const matchesTransmission =
      filters.transmission === "All" ||
      car.transmission === filters.transmission;
    const matchesFuelType =
      filters.fuelType === "All" || car.fuelType === filters.fuelType;
    const matchesCarType =
      filters.carType === "All" || car.carType === filters.carType;
    const matchesBrand = filters.brand === "All" || car.brand === filters.brand;

    return (
      matchesQuery &&
      matchesTransmission &&
      matchesFuelType &&
      matchesCarType &&
      matchesBrand
    );
  });

  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <Navbar />
        <SearchFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className={styles.pageContent}>
        <Breadcrumb
          items={[{ label: "Home", to: "/home" }, { label: "Showroom" }]}
        />
        <CarGrid cars={filteredCars} />
        <Footer />
      </div>
    </div>
  );
}
