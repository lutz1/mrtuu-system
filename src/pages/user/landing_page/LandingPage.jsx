import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useVehicles } from "../../../context/VehiclesContext";
import { useTheme } from "../../../context/ThemeContext";
import Navbar from "../../../components/user/frontpage/Navbar";
import SearchFilterBar from "../../../components/user/SearchFilterBar";
import Hero from "../../../components/user/frontpage/Hero";
import FeaturedCars from "../../../components/user/frontpage/FeaturedCars";
import WhyRentWithUs from "../../../components/user/frontpage/WhyRentWithUs";
import HowItWorks from "../../../components/user/frontpage/HowItWorks";
import TrustedPartner from "../../../components/user/frontpage/TrustedPartner";
import CTABanner from "../../../components/user/frontpage/CTABanner";
import Footer from "../../../components/user/frontpage/Footer";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const { isLoggedIn } = useAuth();
  const { vehicles } = useVehicles();

  const [filters, setFilters] = useState({
    query: "",
    transmission: "All",
    fuelType: "All",
    carType: "All",
    brand: "All",
  });

  const { theme, setTheme } = useTheme();

  // The landing page is theme-independent: it always renders in the default
  // light mode, regardless of login state or the saved theme preference.
  // It self-corrects if anything else flips the theme while mounted, and
  // restores the user's saved theme when they navigate away.
  useEffect(() => {
    if (theme !== "light") setTheme("light");
  }, [theme, setTheme]);

  useEffect(() => {
    return () => {
      const saved = window.localStorage.getItem("lyka-theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    };
  }, [setTheme]);

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
        {isLoggedIn && (
          <SearchFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      <div className={styles.pageContent}>
        <Hero />
        <FeaturedCars cars={isLoggedIn ? filteredCars : vehicles} />
        <WhyRentWithUs />
        <HowItWorks />
        <TrustedPartner />
        <CTABanner />
        <Footer />
      </div>
    </div>
  );
}
