import React from "react";
import { HOW_IT_WORKS } from "../../data/content";
import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  return (
    <section className={styles.howItWorksWrapper}>
      <div className={styles.howItWorks}>
        <h2 className={styles.sectionTitleLight}>How It Works</h2>
        <div className={styles.stepsGrid}>
          {HOW_IT_WORKS.map((item) => (
            <div className={styles.stepItem} key={item.step}>
              <div className={styles.stepNumber}>{item.step}</div>
              <div>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}