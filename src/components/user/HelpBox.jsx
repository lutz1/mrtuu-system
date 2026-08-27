import styles from "./HelpBox.module.css";

export default function HelpBox() {
  return (
    <div className={styles.helpBox}>
      <svg className={styles.helpIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M9.5 9.2a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .8-1 1.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
      </svg>
      <div>
        <p className={styles.helpTitle}>Need help?</p>
        <p className={styles.helpText}>
          Call us 24/7 at 099999999 or Message on our FB Page: Lyka's Car Rental
        </p>
      </div>
    </div>
  );
}