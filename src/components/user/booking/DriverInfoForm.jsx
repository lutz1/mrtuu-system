import React from "react";
import styles from "./DriverInfoForm.module.css";

export default function DriverInfoForm({ driver, onChange }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <svg className={styles.headingIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
        <h2 className={styles.cardTitle}>Driver Information</h2>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            className={styles.formInput}
            placeholder="Selsite Tortskie"
            value={driver.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className={styles.formInput}
            placeholder="tortskie@gmail.com"
            value={driver.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            className={styles.formInput}
            placeholder="09957463523"
            value={driver.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="licenseNo">Driver's License No.</label>
          <input
            id="licenseNo"
            type="text"
            className={styles.formInput}
            placeholder="ABCD12344567"
            value={driver.licenseNo}
            onChange={(e) => onChange("licenseNo", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}