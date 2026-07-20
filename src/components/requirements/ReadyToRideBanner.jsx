import React from "react";
import { Link } from "react-router-dom";
import ctaImage from "../../assets/windshield.png";
import styles from "./ReadyToRideBanner.module.css";

export default function ReadyToRideBanner() {
  return (
    <section className={styles.banner} style={{ backgroundImage: `url(${ctaImage})` }}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h2 className={styles.title}>Ready to hit the road?</h2>
        <p className={styles.subtitle}>
          Make sure you have all the documents above ready at the time of pickup to ensure a smooth start to your journey.
        </p>

        <div className={styles.actions}>
          <Link to="/showroom" className={styles.primaryBtn}>Book Now</Link>
          <Link to="/contact" className={styles.secondaryBtn}>Contact Support</Link>
        </div>
      </div>
    </section>
  );
}