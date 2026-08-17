import { useState } from "react";
import styles from "./AddUserPage.module.css";

// --- Small inline icons (kept local so this file has no new deps) ---
function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 19c1.2-4 3.8-5.8 7-5.8s5.8 1.8 7 5.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 10.5V8a6 6 0 0 1 12 0v2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="4.5"
        y="10.5"
        width="15"
        height="9.5"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function EyeIcon({ off }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 12S5.8 5.5 12 5.5 21.5 12 21.5 12 18.2 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.6" />
      {off && (
        <path
          d="M4 4l16 16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

const ROLE_OPTIONS = ["Owner", "Admin", "Dispatcher"];

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  username: "",
  password: "",
  confirmPassword: "",
};

/**
 * Full-page "Add User Account" form.
 *
 * This mirrors the AdminLayout page pattern used elsewhere (e.g. AdminUsersPage) —
 * render it in place of the users list when the "Add User" button is clicked,
 * or wire `onBack`/`onSubmit` up to your router if you'd rather give it its own route.
 *
 * onSubmit is called as onSubmit({ fullName, email, phone, role, username, password })
 * — adapt the call site to however addStaffByEmail(email, role, permissions) expects
 * the extra profile fields to be shaped.
 */
export default function AddUserPage({ onBack, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.email.trim()) next.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.role) next.role = "Select a role.";
    if (!form.username.trim()) next.username = "Username is required.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit?.({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        username: form.username.trim(),
        password: form.password,
      });
      setForm(EMPTY_FORM);
    } catch (err) {
      setSubmitError(err?.message || "Failed to create user. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button type="button" className={styles.backLink} onClick={onBack}>
        <BackIcon />
        Back to Users
      </button>

      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Add User Account</h1>
        <p className={styles.subtitle}>
          Create a new user account. Fill in the details below.
        </p>
      </div>

      <form className={styles.card} onSubmit={handleSubmit} noValidate>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <PersonIcon />
            </span>
            <div>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              <p className={styles.sectionSubtitle}>
                Enter the basic details of the user.
              </p>
            </div>
          </div>

          <div className={styles.grid}>
            <Field
              label="Full Name"
              error={errors.fullName}
              inputProps={{
                value: form.fullName,
                onChange: update("fullName"),
                placeholder: "Enter full name",
                autoComplete: "name",
              }}
            />
            <Field
              label="Email Address"
              error={errors.email}
              inputProps={{
                type: "email",
                value: form.email,
                onChange: update("email"),
                placeholder: "Enter email address",
                autoComplete: "email",
              }}
            />
            <Field
              label="Phone Number"
              error={errors.phone}
              inputProps={{
                value: form.phone,
                onChange: update("phone"),
                placeholder: "Enter phone number",
                autoComplete: "tel",
              }}
            />
            <div className={styles.field}>
              <label className={styles.label} htmlFor="au-role">
                Role
              </label>
              <select
                id="au-role"
                className={`${styles.input} ${styles.select} ${
                  errors.role ? styles.inputError : ""
                }`}
                value={form.role}
                onChange={update("role")}
              >
                <option value="" disabled>
                  Select role
                </option>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.role && (
                <span className={styles.errorText}>{errors.role}</span>
              )}
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <LockIcon />
            </span>
            <div>
              <h2 className={styles.sectionTitle}>Login Information</h2>
              <p className={styles.sectionSubtitle}>
                Set up login credentials for this account.
              </p>
            </div>
          </div>

          <div className={styles.grid}>
            <Field
              label="Username"
              error={errors.username}
              full
              inputProps={{
                value: form.username,
                onChange: update("username"),
                placeholder: "Enter username",
                autoComplete: "username",
              }}
            />
            <Field
              label="Password"
              error={errors.password}
              inputProps={{
                type: showPassword ? "text" : "password",
                value: form.password,
                onChange: update("password"),
                placeholder: "Enter password",
                autoComplete: "new-password",
              }}
              endAdornment={
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon off={showPassword} />
                </button>
              }
            />
            <Field
              label="Confirm Password"
              error={errors.confirmPassword}
              inputProps={{
                type: showConfirm ? "text" : "password",
                value: form.confirmPassword,
                onChange: update("confirmPassword"),
                placeholder: "Confirm password",
                autoComplete: "new-password",
              }}
              endAdornment={
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  <EyeIcon off={showConfirm} />
                </button>
              }
            />
          </div>
        </section>

        {submitError && (
          <p className={styles.submitError} role="alert">
            {submitError}
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onBack}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? "Creating…" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, inputProps, endAdornment, full }) {
  const id = `au-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={`${styles.field} ${full ? styles.fieldFull : ""}`}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input
          id={id}
          className={`${styles.input} ${error ? styles.inputError : ""} ${
            endAdornment ? styles.inputWithAdornment : ""
          }`}
          {...inputProps}
        />
        {endAdornment}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}