import React, { useState } from "react";
import { IconSearch } from "./icons";
import styles from "./SearchFilterBar.module.css";

export default function SearchFilterBar({ filters: filtersProp, onFilterChange: onFilterChangeProp }) {
  const [localFilters, setLocalFilters] = useState({
    query: "",
    transmission: "All",
    fuelType: "All",
    carType: "All",
    brand: "All",
  });

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const filters = filtersProp ?? localFilters;
  const onFilterChange =
    onFilterChangeProp ??
    ((field, value) => setLocalFilters((prev) => ({ ...prev, [field]: value })));

  const filterFields = (
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
  );

  return (
    <>
      <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Toyota Corolla"
          value={filters.query}
          onChange={(e) => onFilterChange("query", e.target.value)}
          className={styles.searchInput}
        />

        {/* Desktop/tablet — filters render inline as before */}
        <div className={styles.filtersDesktop}>{filterFields}</div>

        {/* Mobile — toggle button instead of inline filters */}
        <button
          type="button"
          className={styles.filterToggleBtn}
          onClick={() => setIsFilterPanelOpen(true)}
          aria-label="Open filters"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <IconSearch className={styles.searchBtnIcon} />
        </button>
      </form>

      {/* Mobile filter overlay */}
      {isFilterPanelOpen && (
        <div className={styles.filterOverlay} onClick={() => setIsFilterPanelOpen(false)}>
          <div className={styles.filterPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.filterPanelHeader}>
              <span className={styles.filterPanelTitle}>Filters</span>
              <button
                type="button"
                className={styles.filterCloseBtn}
                onClick={() => setIsFilterPanelOpen(false)}
                aria-label="Close filters"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {filterFields}

            <button
              type="button"
              className={styles.applyFiltersBtn}
              onClick={() => setIsFilterPanelOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}