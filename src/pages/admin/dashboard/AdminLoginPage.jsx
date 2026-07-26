import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import logo from "../../../assets/logo.png";
import styles from "./AdminLoginPage.module.css";
import { IconMail, IconLock, IconEye, IconEyeOff } from "../../../components/user/icons/AuthIcons";
import "../../../components/user/icons/authShared.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await adminLogin(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid admin email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <img src={logo} alt="Lyka's Car Rental" className={styles.logo} />

        <h1 className={styles.formTitle}>
          <span className={styles.gold}>Lyka's Car Rental</span> Admin
        </h1>
        <p className={styles.subtitle}>Sign in to manage bookings, fleet, and checklists.</p>

        {error && <p className={styles.errorText}>{error}</p>}

        <label className={styles.inputWrapper}>
          <IconMail className="authInputIcon" />
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            disabled={isSubmitting}
            required
          />
        </label>

        <label className={styles.inputWrapper}>
          <IconLock className="authInputIcon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            disabled={isSubmitting}
            required
          />
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <IconEyeOff className="authToggleIcon" />
            ) : (
              <IconEye className="authToggleIcon" />
            )}
          </button>
        </label>

        <button type="submit" className={styles.loginBtn} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className={styles.spinner} />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        {/* TODO: TEMPORARY — remove this hint the moment real admin auth
            exists. It's here only so the team can test the placeholder
            login without the credentials living in a chat/README. */}
        <p className={styles.devHint}>Dev only: admin@lyka.com / admin123</p>
      </form>
    </div>
  );
}