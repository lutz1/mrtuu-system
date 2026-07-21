import React from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/frontpage/Navbar";
import Footer from "../../components/frontpage/Footer";
import SearchFilterBar from "../../components/SearchFilterBar";
import ContactHero from "../../components/contact/ContactHero";
import ContactForm from "../../components/contact/ContactForm";
import ContactInfoCards from "../../components/contact/ContactInfoCards";
import ContactMap from "../../components/contact/ContactMap";
import ReadyToRideBanner from "../../components/requirements/ReadyToRideBanner";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className={`${styles.page} ${isLoggedIn ? styles.pageThemed : ""}`}>
      <div className={styles.stickyHeader}>
        <Navbar />
        <div className={styles.searchBarWrapper}>
          <SearchFilterBar />
        </div>
      </div>

      <ContactHero />

      <div className={styles.contentWrapper}>
        <div className={styles.mainGrid}>
          <ContactForm />
          <ContactInfoCards />
        </div>

        <ContactMap />
      </div>

      <ReadyToRideBanner />

      <Footer />
    </div>
  );
}