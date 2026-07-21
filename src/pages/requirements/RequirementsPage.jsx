import React from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/frontpage/Navbar";
import Footer from "../../components/frontpage/Footer";
import SearchFilterBar from "../../components/SearchFilterBar";
import RequirementsHero from "../../components/requirements/RequirementsHero";
import RentalPoliciesGrid from "../../components/requirements/RentalPoliciesGrid";
import DocumentationSecurityGrid from "../../components/requirements/DocumentationSecurityGrid";
import ReadyToRideBanner from "../../components/requirements/ReadyToRideBanner";
import styles from "./RequirementsPage.module.css";

export default function RequirementsPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className={`${styles.page} ${isLoggedIn ? styles.pageThemed : ""}`}>
      <div className={styles.stickyHeader}>
        <Navbar />
        <div className={styles.searchBarWrapper}>
          <SearchFilterBar />
        </div>
      </div>

      <RequirementsHero />

      <div className={styles.contentWrapper}>
        <RentalPoliciesGrid />
        <DocumentationSecurityGrid />
      </div>

      <ReadyToRideBanner />

      <Footer />
    </div>
  );
}