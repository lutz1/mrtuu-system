import React from "react";
import styles from "./PageHero.module.css";

export default function PageHero({ eyebrow, title, subtitle, image }) {
  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${image})` }}>
      <div className={styles.overlay} />
      <div className={styles.heroContent}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </section>
  );
}