import styles from "./VerificationCard.module.css";

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 6.5L12 13l8.5-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2C10.5 19 5 13.5 4.5 5a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export default function VerificationCard({ type, value, verified, description, onChange }) {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <span className={styles.iconWrap}>
          {type === "email" ? <EmailIcon /> : <PhoneIcon />}
        </span>

        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{type === "email" ? "Email Verification" : "Phone Number"}</h3>
            <span className={`${styles.badge} ${verified ? styles.verified : styles.unverified}`}>
              {verified ? "Verified" : "Unverified"}
            </span>
          </div>
          <p className={styles.value}>{value || "Not set"}</p>
        </div>
      </div>

      <p className={styles.description}>{description}</p>

      <button type="button" className={styles.actionBtn} onClick={onChange}>
        {type === "email" ? "Change Email Address" : "Change Phone Number"}
      </button>
    </div>
  );
}