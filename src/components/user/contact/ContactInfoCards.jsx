import { useAuth } from "../../../context/AuthContext";
import styles from "./ContactInfoCards.module.css";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C10.7 19.5 4.5 13.3 4.5 6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 6.5l7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 8.5h2V5.5h-2c-1.9 0-3.5 1.6-3.5 3.5v2H8.5V14H10.5v6h3v-6h2.2l.6-3H13.5V9c0-.3.2-.5.5-.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.2" cy="7.8" r="1" fill="currentColor" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 4v9.5a3 3 0 1 1-2-2.83V8.2a5.2 5.2 0 0 0 2-1V4h0z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M9 4a5.2 5.2 0 0 0 5 5.1V6.8A3.2 3.2 0 0 1 12 4H9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactInfoCards() {
  const { isLoggedIn } = useAuth();
  const themedClass = isLoggedIn ? styles.themed : "";

  return (
    <div className={styles.column}>
      <div className={styles.quickRow}>
        <div className={`${styles.quickCard} ${themedClass}`}>
          <span className={styles.quickIcon}><PhoneIcon /></span>
          <span className={styles.quickTitle}>Call Us</span>
          <span className={styles.quickValue}>+639 67676767</span>
        </div>

        <div className={`${styles.quickCard} ${themedClass}`}>
          <span className={styles.quickIcon}><MailIcon /></span>
          <span className={styles.quickTitle}>Email Us</span>
          <a href="mailto:lykacarrental@gmail.com" className={styles.quickLink}>
            lykacarrental@gmail.com
          </a>
        </div>
      </div>

      <div className={`${styles.officeCard} ${themedClass}`}>
        <span className={styles.officeIcon}><PinIcon /></span>
        <div>
          <h3 className={styles.officeTitle}>Our Office</h3>
          <p className={styles.officeAddress}>
            Pioneer Ave., Prk. Santa Cruz, Estrella St., Mankilam, Tagum City, Davao del Norte.
          </p>

            <a
            href="https://www.google.com/maps/search/?api=1&query=Pioneer+Ave+Prk+Santa+Cruz+Estrella+St+Mankilam+Tagum+City"
            target="_blank"
            rel="noreferrer"
            className={styles.directionsLink}
          >
            Get Directions
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* .connectCard is a fixed-dark design chip, like .securityCard and
          the CTA banners — it stays dark regardless of login state, so
          no themed variant applies to it. */}
      <div className={styles.connectCard}>
        <h3 className={styles.connectTitle}>Connect With Us</h3>
        <div className={styles.connectLinks}>
          <a href="#" className={styles.connectLink}>
            <span className={styles.connectIcon}><FacebookIcon /></span>
            Facebook
          </a>
          <a href="#" className={styles.connectLink}>
            <span className={styles.connectIcon}><InstagramIcon /></span>
            Instagram
          </a>
          <a href="#" className={styles.connectLink}>
            <span className={styles.connectIcon}><TiktokIcon /></span>
            Tiktok
          </a>
        </div>
      </div>
    </div>
  );
}