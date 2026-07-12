import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import { CARS, RENTAL_POLICIES } from "../data/cars";
import styles from "./VehicleOverviewPage.module.css";

const FOOTER_COLUMNS = [
  { title: "Header Text", links: ["Button", "Button", "Button", "Button"] },
  { title: "Header Text", links: ["Button", "Button", "Button", "Button"] },
  { title: "Header Text", links: ["Button", "Button", "Button", "Button"] },
];

const FEATURES_PREVIEW_COUNT = 4;

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

const IconCheck = () => (
  <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconPlus = () => (
  <svg className={styles.accordionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconMinus = () => (
  <svg className={styles.accordionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14" />
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

function SearchFilterBar() {
  // Read-only display here — the person already narrowed things down on the
  // Showroom page. Wire this up to real filtering state if you want the
  // bar to be interactive on this page too.
  return (
    <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          placeholder="Search by car model"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <IconSearch />
        </button>
      </div>

      <div className={styles.filters}>
        <label className={styles.filterItem}>
          <span className={styles.filterLabel}>Transmission:</span>
          <select className={styles.filterSelect} defaultValue="Automatic">
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </label>

        <label className={styles.filterItem}>
          <span className={styles.filterLabel}>Fuel Type:</span>
          <select className={styles.filterSelect} defaultValue="Diesel">
            <option>Diesel</option>
            <option>Petrol</option>
            <option>Electric</option>
          </select>
        </label>

        <label className={styles.filterItem}>
          <span className={styles.filterLabel}>Car Type:</span>
          <select className={styles.filterSelect} defaultValue="Sedan">
            <option>Sedan</option>
            <option>SUV</option>
            <option>Hatchback</option>
            <option>Pickup</option>
          </select>
        </label>

        <label className={styles.filterItem}>
          <span className={styles.filterLabel}>Brand:</span>
          <select className={styles.filterSelect} defaultValue="Honda">
            <option>Honda</option>
            <option>Toyota</option>
            <option>Suzuki</option>
            <option>Ford</option>
          </select>
        </label>
      </div>
    </form>
  );
}

function Breadcrumb({ carName }) {
  return (
    <div className={styles.breadcrumb}>
      <Link to="/home" className={styles.breadcrumbLink}>
        Home
      </Link>
      <span className={styles.breadcrumbSeparator}>/</span>
      <Link to="/showroom" className={styles.breadcrumbLink}>
        Showroom
      </Link>
      <span className={styles.breadcrumbSeparator}>/</span>
      <span className={styles.breadcrumbCurrent}>{carName}</span>
    </div>
  );
}

function Gallery({ images, carName }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryMain}>
        <img src={activeImage} alt={carName} className={styles.galleryMainImage} />
      </div>
      <div className={styles.galleryThumbs}>
        {images.slice(1, 5).map((img, i) => (
          <button
            key={i}
            type="button"
            className={styles.galleryThumbBtn}
            onClick={() => setActiveImage(img)}
          >
            <img src={img} alt={`${carName} view ${i + 2}`} className={styles.galleryThumbImage} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Features({ features }) {
  const [showAll, setShowAll] = useState(false);
  const visibleFeatures = showAll
    ? features
    : features.slice(0, FEATURES_PREVIEW_COUNT);

  return (
    <div className={styles.featuresSection}>
      <h2 className={styles.sectionHeading}>Features</h2>
      <ul className={styles.featuresList}>
        {visibleFeatures.map((feature, i) => (
          <li key={i} className={styles.featureItem}>
            <IconCheck />
            {feature}
          </li>
        ))}
      </ul>
      {features.length > FEATURES_PREVIEW_COUNT && (
        <button
          type="button"
          className={styles.showMoreBtn}
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function RentalPolicies({ policies }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <div className={styles.policiesSection}>
      <h2 className={styles.sectionHeading}>Rental Policies</h2>
      <div className={styles.accordionList}>
        {policies.map((policy, i) => {
          const isOpen = openIndex === i;
          return (
            <div className={styles.accordionItem} key={i}>
              <button
                type="button"
                className={styles.accordionTrigger}
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                <span>{policy.title}</span>
                {isOpen ? <IconMinus /> : <IconPlus />}
              </button>
              {isOpen && (
                <p className={styles.accordionContent}>{policy.content}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookingPanel() {
  // Placeholder for the booking widget (date pickers, total price, "Book Now"
  // button, etc). Left blank to match the reference design — build this out
  // once booking logic/backend is ready.
  return <aside className={styles.bookingPanel} />;
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

export default function VehicleOverviewPage() {
  const { id } = useParams();
  const car = CARS.find((c) => String(c.id) === id);

  if (!car) {
    return (
      <div className={styles.page}>
        <NavbarLoggedIn userName="Juan Dela Cruz" />
        <SearchFilterBar />
        <div className={styles.notFound}>
          <p>We couldn't find that vehicle.</p>
          <Link to="/showroom" className={styles.notFoundLink}>
            Back to Showroom
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <NavbarLoggedIn userName="Juan Dela Cruz" />
      <SearchFilterBar />
      <Breadcrumb carName={car.name} />

      <div className={styles.contentWrapper}>
        <Gallery images={car.images} carName={car.name} />

        <div className={styles.mainGrid}>
          <div className={styles.mainColumn}>
            <div className={styles.titleRow}>
              <h1 className={styles.carName}>{car.name}</h1>
              <div className={styles.carPrice}>
                <span className={styles.priceAmount}>
                  ₱{car.price.toLocaleString()}
                </span>
                <span className={styles.priceUnit}>per day</span>
              </div>
            </div>

            <div className={styles.specsRow}>
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
                {car.seats} Seats
              </span>
              <span className={styles.specItem}>
                <IconMileage />
                {car.mileage} km
              </span>
            </div>

            <div className={styles.aboutSection}>
              <h2 className={styles.sectionHeading}>About this vehicle</h2>
              <p className={styles.aboutText}>{car.description}</p>
            </div>

            <Features features={car.features} />
            <RentalPolicies policies={RENTAL_POLICIES} />
          </div>

          <BookingPanel />
        </div>
      </div>

      <Footer />
    </div>
  );
}