import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import styles from "./LandingPageLoggedIn.module.css";

// ---------- Static content (same as LandingPage — swap with real data / CMS later) ----------

const CARS = [
  {
    id: 1,
    name: "Toyota Fortuner",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80",
    transmission: "Automatic",
    fuelType: "Diesel",
    carType: "SUV",
    brand: "Toyota",
    seats: 7,
    location: "Unlimited",
  },
  {
    id: 2,
    name: "Suzuki Swift",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=600&q=80",
    transmission: "Manual",
    fuelType: "Gasoline",
    carType: "Hatchback",
    brand: "Suzuki",
    seats: 5,
    location: "Unlimited",
  },
  {
    id: 3,
    name: "Toyota Corolla",
    image: "https://images.unsplash.com/photo-1623869675184-1ca29c15f6a5?auto=format&fit=crop&w=600&q=80",
    transmission: "Automatic",
    fuelType: "Gasoline",
    carType: "Sedan",
    brand: "Toyota",
    seats: 5,
    location: "Unlimited",
  },
  {
    id: 4,
    name: "Ford Mustang",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=600&q=80",
    transmission: "Automatic",
    fuelType: "Gasoline",
    carType: "Sedan",
    brand: "Ford",
    seats: 4,
    location: "Unlimited",
  },
  {
    id: 5,
    name: "Honda CR-V",
    image: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=600&q=80",
    transmission: "Automatic",
    fuelType: "Gasoline",
    carType: "SUV",
    brand: "Honda",
    seats: 5,
    location: "Unlimited",
  },
  {
    id: 6,
    name: "Mitsubishi Mirage",
    image: "https://images.unsplash.com/photo-1617469767053-8f35aaa39702?auto=format&fit=crop&w=600&q=80",
    transmission: "Manual",
    fuelType: "Gasoline",
    carType: "Hatchback",
    brand: "Mitsubishi",
    seats: 5,
    location: "Unlimited",
  },
  {
    id: 7,
    name: "Nissan Navara",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
    transmission: "Automatic",
    fuelType: "Diesel",
    carType: "Pickup",
    brand: "Nissan",
    seats: 5,
    location: "Unlimited",
  },
  {
    id: 8,
    name: "Hyundai Accent",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80",
    transmission: "Automatic",
    fuelType: "Gasoline",
    carType: "Sedan",
    brand: "Hyundai",
    seats: 5,
    location: "Unlimited",
  },
];

const WHY_US = [
  { id: 1, icon: "🚗", title: "Variety of Cars", description: "Find the perfect vehicle for any trip." },
  { id: 2, icon: "💳", title: "Best Value", description: "Transparent pricing with no hidden charges." },
  { id: 3, icon: "🔖", title: "Quick Booking", description: "Book your car in minutes, anytime, anywhere." },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Choose Your Car", description: "Browse our available vehicles and select the one that fits your needs." },
  { step: 2, title: "Select Your Dates", description: "Choose your pickup and return schedule." },
  { step: 3, title: "Confirm Your Booking", description: "Complete your reservation and get ready to drive." },
];

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

const IconSeats = () => (
  <svg className={styles.specIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="3" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconLocation = () => (
  <svg className={styles.specIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
    <circle cx="12" cy="10" r="3" />
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
        <Link to="/" className={styles.logo}>
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
    // The filtering already happens live as the user types (see onFilterChange),
    // so this just prevents a page reload on Enter/click.
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
            <option>Gasoline</option>
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

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>Lyka's Car Rental</p>
        <h1 className={styles.heroTitle}>
          Drive Your Journey
          <br />
          with <span className={styles.gold}>Confidence</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Choose from a wide selection of reliable vehicles at affordable
          prices. Whether it's for business, travel, or everyday driving,
          we've got the perfect car for you.
        </p>
        <div className={styles.heroActions}>
          <button className={styles.primaryBtn}>
            Book a Car <span className={styles.btnArrow}>→</span>
          </button>
          <button className={styles.secondaryBtn}>Browse Fleet</button>
        </div>
      </div>
    </section>
  );
}

function CarCard({ car }) {
  return (
    <article className={styles.carCard}>
      <img className={styles.carImage} src={car.image} alt={car.name} />
      <div className={styles.carBody}>
        <h3 className={styles.carName}>{car.name}</h3>
        <div className={styles.carSpecs}>
          <span className={styles.specItem}>
            <IconTransmission />
            {car.transmission}
          </span>
          <span className={styles.specItem}>
            <IconSeats />
            {car.seats}
          </span>
          <span className={styles.specItem}>
            <IconLocation />
            {car.location}
          </span>
        </div>
        <button className={styles.viewCarBtn}>View Car</button>
      </div>
    </article>
  );
}

function FeaturedCars({ cars }) {
  return (
    <section className={styles.featuredCars}>
      <h2 className={styles.sectionTitleLight}>Featured Cars</h2>
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

function WhyRentWithUs() {
  return (
    <section className={styles.whyUs}>
      <h2 className={styles.sectionTitleDark}>Why Rent With Us?</h2>
      <p className={styles.sectionSubtitle}>
        We make renting a car simple, affordable, and hassle-free.
      </p>
      <div className={styles.whyUsGrid}>
        {WHY_US.map((item) => (
          <div className={styles.whyUsItem} key={item.id}>
            <div className={styles.whyUsIconCircle}>
              <span className={styles.whyUsIcon}>{item.icon}</span>
            </div>
            <h3 className={styles.whyUsTitle}>{item.title}</h3>
            <p className={styles.whyUsDescription}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className={styles.howItWorksWrapper}>
      <div className={styles.howItWorks}>
        <h2 className={styles.sectionTitleLight}>How It Works</h2>
        <div className={styles.stepsGrid}>
          {HOW_IT_WORKS.map((item) => (
            <div className={styles.stepItem} key={item.step}>
              <div className={styles.stepNumber}>{item.step}</div>
              <div>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustedPartner() {
  return (
    <section className={styles.trustedPartner}>
      <div className={styles.trustedText}>
        <h2 className={styles.trustedTitle}>Your Trusted Car Rental Partner</h2>
        <p className={styles.trustedDescription}>
          We are committed to providing reliable vehicles, affordable rates,
          and excellent customer service. Whether you're traveling for
          business or leisure, our goal is to make every journey smooth,
          safe, and convenient.
        </p>
      </div>
      <div className={styles.trustedImageWrapper}>
        <img
          className={styles.trustedImage}
          src="https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=800&q=80"
          alt="Happy family with their rental car"
        />
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className={styles.ctaBanner}>
      <div className={styles.ctaOverlay} />
      <div className={styles.ctaContent}>
        <p className={styles.eyebrow}>Lyka's Car Rental</p>
        <h2 className={styles.ctaTitle}>Ready for Your Next Adventure?</h2>
        <p className={styles.ctaSubtitle}>
          Book your ideal vehicle today and experience safe, convenient, and
          affordable travel.
        </p>
        <button className={styles.primaryBtn}>Book Now</button>
      </div>
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

export default function LandingPageLoggedIn() {
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
      <Hero />
      <FeaturedCars cars={filteredCars} />
      <WhyRentWithUs />
      <HowItWorks />
      <TrustedPartner />
      <CTABanner />
      <Footer />
    </div>
  );
}