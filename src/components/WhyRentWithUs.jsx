import React from "react";
import { WHY_US } from "../data/content";
import styles from "./WhyRentWithUs.module.css";

export default function WhyRentWithUs() {
  return (
    <section className={styles.whyUs}>
      <h2 className={styles.sectionTitleDark}>Why Rent With Us?</h2>
      <p className={styles.sectionSubtitle}>
        We make renting a car simple, affordable, and hassle-free.
      </p>
      <div className={styles.whyUsGrid}>
        {WHY_US.map((item) => (
          <div className={styles.whyUsItem} key={item.id}>
            <div className={styles.whyUsIconCircle}>
              <span className={styles.whyUsIcon}>{item.icon}</span>
            </div>
            <h3 className={styles.whyUsTitle}>{item.title}</h3>
            <p className={styles.whyUsDescription}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}