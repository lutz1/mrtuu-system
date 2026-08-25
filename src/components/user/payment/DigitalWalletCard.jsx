import styles from "./DigitalWalletCard.module.css";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function DigitalWalletCard({ wallet, onManage, onConnect }) {
  return (
    <div className={styles.card}>
      <p className={styles.provider}>{wallet.provider}</p>

      {wallet.connected ? (
        <>
          <p className={styles.accountNumber}>{wallet.accountNumber}</p>
          <button type="button" className={styles.linkBtn} onClick={() => onManage?.(wallet)}>
            Manage
          </button>
        </>
      ) : (
        <>
          <p className={styles.notConnected}>Not Connected</p>
          <button type="button" className={styles.linkBtnUnderline} onClick={() => onConnect?.(wallet)}>
            Connect Account
          </button>
        </>
      )}
    </div>
  );
}

export function AddWalletCard({ onAdd }) {
  return (
    <button type="button" className={styles.addCard} onClick={onAdd}>
      <span className={styles.addIcon}>
        <PlusIcon />
      </span>
      <span className={styles.addLabel}>Add Another Wallet</span>
    </button>
  );
}