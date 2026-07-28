import { useState } from "react";
import styles from "./ChangePasswordForm.module.css";

export default function ChangePasswordForm({ onSubmit, statusMessage }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    setSubmitting(true);
    try {
      // Awaited so we only clear the form once the parent's onSubmit
      // (which calls Firebase's changePassword) actually resolves —
      // previously the fields were wiped even when the request failed,
      // hiding the failure from the user along with the error message.
      await onSubmit?.({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // Parent (PrivacySecurityPage) is responsible for surfacing the
      // error via statusMessage; nothing further to do here except
      // keep the fields populated so the user can retry.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Change Password</h3>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Current Password</span>
          <input
            type="password"
            className={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>New Password</span>
          <input
            type="password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Confirm Password</span>
          <input
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}
        {!error && statusMessage && (
          <p className={styles.notice}>{statusMessage}</p>
        )}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </section>
  );
}
