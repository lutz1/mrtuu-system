import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/header.png"; // your actual import
import styles from "./Hero.module.css";


export default function Hero() {
  return (
    <section className={styles.hero}>
      <div
        className={styles.heroImage}
        style={{ backgroundImage: `url(${heroImage})` }}
      />
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
          <button type="button" className={styles.primaryBtn}>
            Book a Car <span className={styles.btnArrow}>→</span>
          </button>
          <Link to="/showroom" className={styles.secondaryBtn}>
            Browse Fleet
          </Link>
        </div>
      </div>
    </section>
  );
}