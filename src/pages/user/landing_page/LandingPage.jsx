import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../../components/user/frontpage/Navbar";
import SearchFilterBar from "../../../components/user/SearchFilterBar";
import Hero from "../../../components/user/frontpage/Hero";
import FeaturedCars from "../../../components/user/frontpage/FeaturedCars";
import WhyRentWithUs from "../../../components/user/frontpage/WhyRentWithUs";
import HowItWorks from "../../../components/user/frontpage/HowItWorks";
import TrustedPartner from "../../../components/user/frontpage/TrustedPartner";
import CTABanner from "../../../components/user/frontpage/CTABanner";
import Footer from "../../../components/user/frontpage/Footer";
import { CARS } from "../../../data/cars";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const { isLoggedIn } = useAuth();

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
        {isLoggedIn && (
          <SearchFilterBar filters={filters} onFilterChange={handleFilterChange} />
        )}
      </div>

      <div className={styles.pageContent}>
        <Hero />
        <FeaturedCars cars={isLoggedIn ? filteredCars : CARS} />
        <WhyRentWithUs />
        <HowItWorks />
        <TrustedPartner />
        <CTABanner />
        <Footer />
      </div>
    </div>
  );
}