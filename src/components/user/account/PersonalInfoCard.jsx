import styles from "./PersonalInfoCard.module.css";

export default function PersonalInfoCard({
  personal,
  editingPersonal,
  personalDraft,
  onStartEdit,
  onDraftChange,
  onSave,
  onCancel,
}) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeaderRow}>
        <h3 className={styles.cardTitle}>Personal Information</h3>
        {!editingPersonal && (
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
          {editingPersonal ? (
            <>
              <label htmlFor="personal-firstName" className={styles.fieldLabel}>Name</label>
              <input
                id="personal-firstName"
                type="text"
                className={styles.fieldInput}
                value={personalDraft.firstName}
                onChange={(e) => onDraftChange("firstName", e.target.value)}
              />
            </>
          ) : (
            <>
              <span className={styles.fieldLabel}>Name</span>
              <span className={styles.fieldValue}>{personal.firstName || "—"}</span>
            </>
          )}
        </div>

        <div className={styles.field}>
          {editingPersonal ? (
            <>
              <label htmlFor="personal-lastName" className={styles.fieldLabel}>Last Name</label>
              <input
                id="personal-lastName"
                type="text"
                className={styles.fieldInput}
                value={personalDraft.lastName}
                onChange={(e) => onDraftChange("lastName", e.target.value)}
              />
            </>
          ) : (
            <>
              <span className={styles.fieldLabel}>Last Name</span>
              <span className={styles.fieldValue}>{personal.lastName || "—"}</span>
            </>
          )}
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Email Address</span>
          <span className={styles.fieldValue}>{personal.email || "—"}</span>
        </div>

        <div className={styles.field}>
          {editingPersonal ? (
            <>
              <label htmlFor="personal-phone" className={styles.fieldLabel}>Phone</label>
              <input
                id="personal-phone"
                type="tel"
                className={styles.fieldInput}
                placeholder="e.g. 0967676767"
                value={personalDraft.phone}
                onChange={(e) => onDraftChange("phone", e.target.value)}
              />
            </>
          ) : (
            <>
              <span className={styles.fieldLabel}>Phone</span>
              <span className={styles.fieldValue}>{personal.phone || "Not set"}</span>
            </>
          )}
        </div>
      </div>

      {editingPersonal && (
        <div className={styles.editActions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button type="button" className={styles.saveBtn} onClick={onSave}>Save Changes</button>
        </div>
      )}
    </section>
  );
}