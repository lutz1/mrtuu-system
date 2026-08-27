import styles from "./AddressCard.module.css";

export default function AddressCard({
  address,
  editingAddress,
  addressDraft,
  onStartEdit,
  onDraftChange,
  onSave,
  onCancel,
}) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeaderRow}>
        <h3 className={styles.cardTitle}>Address</h3>
        {!editingAddress && (
          <button type="button" className={styles.editBtn} onClick={onStartEdit}>
            Edit
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          {editingAddress ? (
            <>
              <label htmlFor="address-country" className={styles.fieldLabel}>Country</label>
              <input
                id="address-country"
                type="text"
                className={styles.fieldInput}
                value={addressDraft.country}
                onChange={(e) => onDraftChange("country", e.target.value)}
              />
            </>
          ) : (
            <>
              <span className={styles.fieldLabel}>Country</span>
              <span className={styles.fieldValue}>{address.country || "Not set"}</span>
            </>
          )}
        </div>

        <div className={styles.field}>
          {editingAddress ? (
            <>
              <label htmlFor="address-city" className={styles.fieldLabel}>City</label>
              <input
                id="address-city"
                type="text"
                className={styles.fieldInput}
                value={addressDraft.city}
                onChange={(e) => onDraftChange("city", e.target.value)}
              />
            </>
          ) : (
            <>
              <span className={styles.fieldLabel}>City</span>
              <span className={styles.fieldValue}>{address.city || "Not set"}</span>
            </>
          )}
        </div>

        <div className={styles.field}>
          {editingAddress ? (
            <>
              <label htmlFor="address-postalCode" className={styles.fieldLabel}>Postal Code</label>
              <input
                id="address-postalCode"
                type="text"
                className={styles.fieldInput}
                value={addressDraft.postalCode}
                onChange={(e) => onDraftChange("postalCode", e.target.value)}
              />
            </>
          ) : (
            <>
              <span className={styles.fieldLabel}>Postal Code</span>
              <span className={styles.fieldValue}>{address.postalCode || "Not set"}</span>
            </>
          )}
        </div>

        <div className={styles.field}>
          {editingAddress ? (
            <>
              <label htmlFor="address-province" className={styles.fieldLabel}>Province</label>
              <input
                id="address-province"
                type="text"
                className={styles.fieldInput}
                value={addressDraft.province}
                onChange={(e) => onDraftChange("province", e.target.value)}
              />
            </>
          ) : (
            <>
              <span className={styles.fieldLabel}>Province</span>
              <span className={styles.fieldValue}>{address.province || "Not set"}</span>
            </>
          )}
        </div>
      </div>

      {editingAddress && (
        <div className={styles.editActions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button type="button" className={styles.saveBtn} onClick={onSave}>Save Changes</button>
        </div>
      )}
    </section>
  );
}