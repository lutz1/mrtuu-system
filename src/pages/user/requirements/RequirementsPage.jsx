import React from "react";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../../components/user/frontpage/Navbar";
import Footer from "../../../components/user/frontpage/Footer";
import SearchFilterBar from "../../../components/user/SearchFilterBar";
import RequirementsHero from "../../../components/user/requirements/RequirementsHero";
import RentalPoliciesGrid from "../../../components/user/requirements/RentalPoliciesGrid";
import DocumentationSecurityGrid from "../../../components/user/requirements/DocumentationSecurityGrid";
import ReadyToRideBanner from "../../../components/user/requirements/ReadyToRideBanner";
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