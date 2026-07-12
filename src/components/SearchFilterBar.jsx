import React, { useState } from "react";
import { IconSearch } from "./icons";
import styles from "./SearchFilterBar.module.css";

export default function SearchFilterBar({ filters: filtersProp, onFilterChange: onFilterChangeProp }) {
  // If no filters/onFilterChange are passed in, the bar manages its own
  // local state — useful for pages like VehicleOverviewPage where it's
  // shown for visual consistency but isn't wired to real filtering yet.
  const [localFilters, setLocalFilters] = useState({
    query: "",
    transmission: "All",
    fuelType: "All",
    carType: "All",
    brand: "All",
  });

  const filters = filtersProp ?? localFilters;
  const onFilterChange =
    onFilterChangeProp ??
    ((field, value) => setLocalFilters((prev) => ({ ...prev, [field]: value })));

  return (
    <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          placeholder="Search by car model"
          value={filters.query}
          onChange={(e) => onFilterChange("query", e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <IconSearch className={styles.searchBtnIcon} />
        </button>
      </div>

      <div className={styles.filters}>
        <label className={styles.filterItem}>
          <span className={styles.filterLabel}>Transmission:</span>
          <select
            className={styles.filterSelect}
            value={filters.transmission}
            onChange={(e) => onFilterChange("transmission", e.target.value)}
          >
            <option>All</option>
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </label>

        <label className={styles.filterItem}>
          <span className={styles.filterLabel}>Fuel Type:</span>
          <select
            className={styles.filterSelect}
            value={filters.fuelType}
            onChange={(e) => onFilterChange("fuelType", e.target.value)}
          >
            <option>All</option>
            <option>Diesel</option>
            <option>Petrol</option>
            <option>Electric</option>
          </select>
        </label>

        <label className={styles.filterItem}>
          <span className={styles.filterLabel}>Car Type:</span>
          <select
            className={styles.filterSelect}
            value={filters.carType}
            onChange={(e) => onFilterChange("carType", e.target.value)}
          >
            <option>All</option>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Hatchback</option>
            <option>Pickup</option>
          </select>
        </label>

        <label className={styles.filterItem}>
          <span className={styles.filterLabel}>Brand:</span>
          <select
            className={styles.filterSelect}
            value={filters.brand}
            onChange={(e) => onFilterChange("brand", e.target.value)}
          >
            <option>All</option>
            <option>Honda</option>
            <option>Toyota</option>
            <option>Suzuki</option>
            <option>Ford</option>
            <option>Nissan</option>
            <option>Hyundai</option>
            <option>Mitsubishi</option>
          </select>
        </label>
      </div>
    </form>
  );
}