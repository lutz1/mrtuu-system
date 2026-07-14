import React from "react";
import styles from "./CTABanner.module.css";
import ctaBanner from "../assets/ctabanner.png";

export default function CTABanner() {
  return (
    <section className={styles.ctaBanner}>
      <div
        className={styles.ctaImageWrap}
        style={{ backgroundImage: `url(${ctaBanner})` }}
      >
        <div className={styles.ctaOverlay} />
      </div>

      <div className={styles.ctaFade} />

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