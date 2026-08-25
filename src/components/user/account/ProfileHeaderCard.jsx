import ProfilePictureUpload from "./ProfilePictureUpload";
import styles from "./ProfileHeaderCard.module.css";

export default function ProfileHeaderCard({ user, displayName, email, phone, onEdit }) {
  return (
    <section className={styles.card}>
      <div className={styles.profileHeader}>
        <ProfilePictureUpload photoURL={user?.photoURL} displayName={displayName} />

        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{displayName}</h2>
          <p className={styles.profileLine}>
            <span className={styles.profileLabel}>Email</span> {email || "—"}
          </p>
          <p className={styles.profileLine}>
            <span className={styles.profileLabel}>Phone</span> {phone || "Not set"}
          </p>
        </div>

        <button type="button" className={styles.editBtn} onClick={onEdit}>
          Edit
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}