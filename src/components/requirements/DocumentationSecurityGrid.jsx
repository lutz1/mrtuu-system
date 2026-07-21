import React from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./DocumentationSecurityGrid.module.css";

const DOCUMENTS = [
  { id: "license", title: "Driver's License", description: "Must be valid and held for at least 12 months prior to rental." },
  { id: "id", title: "ID or Passport", description: "A secondary form of government-issued photo identification." },
  { id: "address", title: "Proof of Address", description: "A utility bill or bank statement dated within the last 3 months (local renters only)." },
];

const SECURITY_ITEMS = [
  { id: "creditCard", title: "Credit Card Policy", description: "A major credit card (Visa, Mastercard, Amex) in the lead driver's name is required for the security deposit." },
  { id: "deposit", title: "Security Deposit", description: "An authorization hold (ranging from $500 - $2500) will be placed on your card for the duration of the rental." },
  { id: "debitCard", title: "Debit Cards", description: "Debit cards are accepted for final payment only, not for the initial security deposit hold." },
];

function DocumentIcon({ id }) {
  if (id === "license") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8.5" cy="11" r="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M13.5 10h5M13.5 13h5M6 15.5c.6-1.2 1.7-1.8 2.5-1.8s1.9.6 2.5 1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "id") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5.5 19c1.2-3.4 3.7-5 6.5-5s5.3 1.6 6.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function SecurityIcon({ id }) {
  if (id === "creditCard") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (id === "deposit") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function DocumentationSecurityGrid() {
  const { isLoggedIn } = useAuth();

  return (
    <div className={styles.grid}>
      <section className={`${styles.docCard} ${isLoggedIn ? styles.docCardThemed : ""}`}>
        <h2 className={styles.docTitle}>Mandatory Documentation</h2>

        <div className={styles.docList}>
          {DOCUMENTS.map((doc) => (
            <div key={doc.id} className={styles.docTile}>
              <span className={styles.docIcon}><DocumentIcon id={doc.id} /></span>
              <h3 className={styles.docTileTitle}>{doc.title}</h3>
              <p className={styles.docTileText}>{doc.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* .securityCard is a fixed-dark design chip, like the CTA banners
          and Payment & Security card elsewhere — it stays dark regardless
          of login state, so no themed variant here. */}
      <section className={styles.securityCard}>
        <h2 className={styles.securityTitle}>Payment &amp; Security</h2>

        <div className={styles.securityList}>
          {SECURITY_ITEMS.map((item) => (
            <div key={item.id} className={styles.securityRow}>
              <span className={styles.securityIcon}><SecurityIcon id={item.id} /></span>
              <div>
                <h3 className={styles.securityRowTitle}>{item.title}</h3>
                <p className={styles.securityRowText}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}