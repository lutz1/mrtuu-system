import styles from "./LoginHistoryCard.module.css";

function DesktopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="2.5" width="10" height="19" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 18.5h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function formatLogTimestamp(iso) {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const timePart = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${datePart}, ${timePart}`;
}

export default function LoginHistoryCard({ sessions, securityLog, onLogoutSession }) {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Login History</h3>
      <p className={styles.subtitle}>Review active sessions and recent security logs.</p>

      <div className={styles.sessionList}>
        {sessions.map((session) => (
          <div key={session.id} className={styles.sessionRow}>
            <span className={styles.sessionIcon}>
              {session.deviceType === "mobile" ? <MobileIcon /> : <DesktopIcon />}
            </span>

            <div className={styles.sessionInfo}>
              <p className={styles.sessionDevice}>{session.device}</p>
              <p className={styles.sessionMeta}>
                {session.location} •{" "}
                {session.isCurrent ? (
                  <span className={styles.activeNow}>Active Now</span>
                ) : (
                  session.lastActive
                )}
              </p>
            </div>

            {!session.isCurrent && (
              <button
                type="button"
                className={styles.logoutBtn}
                onClick={() => onLogoutSession?.(session)}
              >
                Log out
              </button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.logDivider} />

      <p className={styles.logHeading}>Security Log</p>
      <div className={styles.logList}>
        {securityLog.map((entry) => (
          <div key={entry.id} className={styles.logRow}>
            <span>{entry.label}</span>
            <span className={styles.logTimestamp}>{formatLogTimestamp(entry.timestamp)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}