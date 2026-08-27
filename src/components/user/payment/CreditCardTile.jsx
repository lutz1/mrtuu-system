import styles from "./CreditCardTile.module.css";

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M17 13.5h-2a1.5 1.5 0 0 0 0 3h2a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CreditCardTile({ card, onEdit, onDelete, onSetDefault }) {
  return (
    <div className={`${styles.tile} ${card.isDefault ? styles.default : styles.secondary}`}>
      <div className={styles.topRow}>
        <div>
          <span className={styles.eyebrow}>{card.isDefault ? "Default Method" : "Personal"}</span>
          <p className={styles.label}>{card.label}</p>
        </div>
        <span className={styles.icon}>
          {card.isDefault ? <CardIcon /> : <WalletIcon />}
        </span>
      </div>

      <p className={styles.number}>
        <span className={styles.dots}>•••• •••• ••••</span> {card.last4}
      </p>

      <div className={styles.bottomRow}>
        <div>
          <span className={styles.eyebrow}>Expiry Date</span>
          <p className={styles.expiry}>{card.expiry}</p>
        </div>

        <div className={styles.actions}>
          {card.isDefault ? (
            <>
              <button type="button" className={styles.iconBtn} onClick={() => onEdit?.(card)} aria-label="Edit card">
                <EditIcon />
              </button>
              <button type="button" className={styles.iconBtn} onClick={() => onDelete?.(card)} aria-label="Delete card">
                <TrashIcon />
              </button>
            </>
          ) : (
            <>
              <button type="button" className={styles.setDefaultBtn} onClick={() => onSetDefault?.(card)}>
                Set as Default
              </button>
              <button type="button" className={styles.iconBtnLight} onClick={() => onDelete?.(card)} aria-label="Delete card">
                <TrashIcon />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}