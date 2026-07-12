import React from "react";
import styles from "./TrustedPartner.module.css";

export default function TrustedPartner() {
  return (
    <section className={styles.trustedPartner}>
      <div className={styles.trustedText}>
        <h2 className={styles.trustedTitle}>Your Trusted Car Rental Partner</h2>
        <p className={styles.trustedDescription}>
          We are committed to providing reliable vehicles, affordable rates,
          and excellent customer service. Whether you're traveling for
          business or leisure, our goal is to make every journey smooth,
          safe, and convenient.
        </p>
      </div>
      <div className={styles.trustedImageWrapper}>
        <img
          className={styles.trustedImage}
          src="https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=800&q=80"
          alt="Happy family with their rental car"
        />
      </div>
    </section>
  );
}