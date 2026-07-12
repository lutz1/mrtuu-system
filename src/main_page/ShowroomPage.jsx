import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchFilterBar from "../components/SearchFilterBar";
import Breadcrumb from "../components/Breadcrumb";
import CarGrid from "../components/CarGrid";
import Footer from "../components/Footer";
import { CARS } from "../data/cars";
import styles from "./ShowroomPage.module.css";

export default function ShowroomPage() {
  const [filters, setFilters] = useState({
    query: "",
    transmission: "All",
    fuelType: "All",
    carType: "All",
    brand: "All",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredCars = CARS.filter((car) => {
    const matchesQuery = car.name.toLowerCase().includes(filters.query.trim().toLowerCase());
    const matchesTransmission = filters.transmission === "All" || car.transmission === filters.transmission;
    const matchesFuelType = filters.fuelType === "All" || car.fuelType === filters.fuelType;
    const matchesCarType = filters.carType === "All" || car.carType === filters.carType;
    const matchesBrand = filters.brand === "All" || car.brand === filters.brand;

    return matchesQuery && matchesTransmission && matchesFuelType && matchesCarType && matchesBrand;
  });

  return (
    <div className={styles.page}>
  <div className={styles.stickyHeader}>
    <Navbar />
    <SearchFilterBar filters={filters} onFilterChange={handleFilterChange} />
  </div>

  <div className={styles.pageContent}>
    <Breadcrumb items={[{ label: "Home", to: "/home" }, { label: "Showroom" }]} />
    <CarGrid cars={filteredCars} />
    <Footer />
  </div>
</div>
  );
}