import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import { CARS } from "../data/cars";
import styles from "./ShowroomPage.module.css";

// Car catalog now lives in src/data/cars.js so this page and the
// Vehicle Overview page both read from the same source.

const FOOTER_COLUMNS = [
  { title: "Header Text", links: ["Button", "Button", "Button", "Button"] },
  { title: "Header Text", links: ["Button", "Button", "Button", "Button"] },
  { title: "Header Text", links: ["Button", "Button", "Button", "Button"] },
];

// ---------- Icons ----------

const IconSearch = () => (
  <svg className={styles.searchBtnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const IconTransmission = () => (
  <svg className={styles.specIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M8 4v16M16 4v16M3 12h5M16 12h5" />
  </svg>
);

const IconFuel = () => (
  <svg className={styles.specIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 22V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14" />
    <path d="M3 12h10" />
    <path d="M15 8h2l3 3v7a1.5 1.5 0 0 1-3 0v-2a1 1 0 0 0-1-1h-1" />
  </svg>
);

const IconSeats = () => (
  <svg className={styles.specIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="3" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconMileage = () => (
  <svg className={styles.specIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// ---------- Section components ----------

function NavbarLoggedIn({ userName = "Juan Dela Cruz" }) {
  const initial = userName.trim().charAt(0).toUpperCase();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navInner}>
        <Link to="/home" className={styles.logo}>
          <img src={logo} alt="Lyka's Car Rental" className={styles.logoImage} />
          <span className={styles.logoText}>Lyka's</span>
        </Link>
        <nav className={styles.navLinks}>
          <a href="#requirements">Requirements</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className={styles.userSection}>
          <Link to="/account" className={styles.userMenu}>
            <span className={styles.userAvatar}>{initial}</span>
            <span className={styles.userName}>{userName.split(" ")[0]}</span>
          </Link>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchFilterBar({ filters, onFilterChange }) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          placeholder="Search by car model"
          value={filters.query}
          onChange={(e) => onFilterChange("query", e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <IconSearch />
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

function Breadcrumb() {
  return (
    <div className={styles.breadcrumb}>
      <Link to="/home" className={styles.breadcrumbLink}>
        Home
      </Link>
      <span className={styles.breadcrumbSeparator}>/</span>
      <span className={styles.breadcrumbCurrent}>Showroom</span>
    </div>
  );
}

function CarCard({ car }) {
  return (
    <article className={styles.carCard}>
      <div className={styles.carImageWrapper}>
        <img className={styles.carImage} src={car.images[0]} alt={car.name} />
      </div>
      <div className={styles.carBody}>
        <div className={styles.carTitleRow}>
          <h3 className={styles.carName}>{car.name}</h3>
          <div className={styles.carPrice}>
            <span className={styles.priceAmount}>
              ₱{car.price.toLocaleString()}
            </span>
            <span className={styles.priceUnit}>per day</span>
          </div>
        </div>

        <div className={styles.carSpecs}>
          <span className={styles.specItem}>
            <IconTransmission />
            {car.transmission}
          </span>
          <span className={styles.specItem}>
            <IconFuel />
            {car.fuelType}
          </span>
          <span className={styles.specItem}>
            <IconSeats />
            {car.seats}
          </span>
          <span className={styles.specItem}>
            <IconMileage />
            {car.mileage}
          </span>
        </div>

        <Link to={`/vehicle/${car.id}`} className={styles.viewDetailsBtn}>
          View Details
        </Link>
      </div>
    </article>
  );
}

function CarGrid({ cars }) {
  return (
    <section className={styles.carGridSection}>
      {cars.length > 0 ? (
        <div className={styles.carsGrid}>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>
          No cars match your search. Try adjusting your filters.
        </p>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.logo}>
            <img src={logo} alt="Lyka's Car Rental" className={styles.logoImage} />
            <span className={styles.logoTextLight}>Lyka's Car Rental</span>
          </div>
          <p className={styles.footerTagline}>
            Book your ideal vehicle and travel with confidence, comfort, and
            convenience.
          </p>
        </div>
        <div className={styles.footerColumns}>
          {FOOTER_COLUMNS.map((col, i) => (
            <div className={styles.footerColumn} key={i}>
              <h4 className={styles.footerColumnTitle}>{col.title}</h4>
              <ul>
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href="#top">
                      <span className={styles.footerChevron}>›</span> {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className={styles.footerCopyright}>
        © 2026 Lyka's Car Rental. All rights reserved.
      </p>
    </footer>
  );
}

// ---------- Page ----------

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
    const matchesQuery = car.name
      .toLowerCase()
      .includes(filters.query.trim().toLowerCase());
    const matchesTransmission =
      filters.transmission === "All" || car.transmission === filters.transmission;
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
      <NavbarLoggedIn userName="Juan Dela Cruz" />
      <SearchFilterBar filters={filters} onFilterChange={handleFilterChange} />
      <Breadcrumb />
      <CarGrid cars={filteredCars} />
      <Footer />
    </div>
  );
}