import React from "react";
import logo from "../../../assets/logo.png";
import { FOOTER_COLUMNS } from "../../../data/content";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.logo}>
            <img src={logo} alt="Lyka's Car Rental" className={styles.logoImage} />
            <span className={styles.logoTextLight}>Lyka's Car Rental</span>
          </div>
          <p className={styles.footerTagline}>
            Book your ideal vehicle and travel with confidence, comfort, and
            convenience.
          </p>
        </div>
        <div className={styles.footerColumns}>
          {FOOTER_COLUMNS.map((col) => (
            <div className={styles.footerColumn} key={col.title}>
              <h4 className={styles.footerColumnTitle}>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#top">
                      <span className={styles.footerChevron}>›</span> {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className={styles.footerCopyright}>
        © 2026 Lyka's Car Rental. All rights reserved.
      </p>
    </footer>
  );
}