import React from "react";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../../components/user/frontpage/Navbar";
import Footer from "../../../components/user/frontpage/Footer";
import SearchFilterBar from "../../../components/user/SearchFilterBar";
import ContactHero from "../../../components/user/contact/ContactHero";
import ContactForm from "../../../components/user/contact/ContactForm";
import ContactInfoCards from "../../../components/user/contact/ContactInfoCards";
import ContactMap from "../../../components/user/contact/ContactMap";
import ReadyToRideBanner from "../../../components/user/requirements/ReadyToRideBanner";
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