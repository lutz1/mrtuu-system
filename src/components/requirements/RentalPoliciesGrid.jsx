import React from "react";
import { useAuth } from "../../context/AuthContext";
import ageRequirementsImage from "../../assets/age-requirements.png";
import styles from "./RentalPoliciesGrid.module.css";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#f0a93a" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function RentalPoliciesGrid() {
  const { isLoggedIn } = useAuth();
  const themedClass = isLoggedIn ? styles.themed : "";

  return (
    <div className={styles.grid}>
      <section className={`${styles.ageCard} ${themedClass}`}>
        <div className={styles.ageText}>
          <h2 className={styles.cardTitle}>Age Requirements</h2>
          <p className={styles.cardSubtitle}>
            To ensure safety and compliance with insurance regulations, we maintain specific age thresholds for our fleet.
          </p>

          <ul className={styles.checkList}>
            <li>
              <span className={styles.checkIcon}><CheckIcon /></span>
              <span>
                <strong>Minimum Age:</strong> 21 years old. Renters must possess a valid Philippine Driver's License
                (Non-Professional or Professional) held for at least 1 year.
              </span>
            </li>
            <li>
              <span className={styles.checkIcon}><CheckIcon /></span>
              <span>
                <strong>Young Drivers Fee:</strong> A daily surcharge applies for renters aged 21-24.
              </span>
            </li>
          </ul>
        </div>

        <img src={ageRequirementsImage} alt="Handing over car keys" className={styles.ageImage} />
      </section>

      <section className={`${styles.internationalCard} ${themedClass}`}>
        <h2 className={styles.cardTitle}>International Drivers</h2>
        <p className={styles.cardSubtitle}>
          Visiting from abroad? We welcome global travelers with valid documentation.
        </p>

        <span className={styles.requirementLabel}>Requirement</span>
        <p className={styles.requirementText}>
          If your license is not in English (Roman script), an <strong>International Driving Permit (IDP)</strong> is
          mandatory along with your original license.
        </p>

        <a href="#" className={styles.eligibleLink}>
          View eligible countries
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>
    </div>
  );
}