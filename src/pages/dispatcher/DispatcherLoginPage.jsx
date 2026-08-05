import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatcherAuth } from "../../context/DispatcherAuthContext";
import logo from "../../assets/logo.png";
import styles from "./DispatcherLoginPage.module.css";
import { IconMail, IconLock, IconEye, IconEyeOff } from "../../components/user/icons/AuthIcons";
import "../../components/user/icons/authShared.css";

export default function DispatcherLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { dispatcherLogin } = useDispatcherAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await dispatcherLogin(email, password);
      navigate("/dispatcher/dashboard");
    } catch (err) {
      setError(err.message || "Invalid dispatcher email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <img src={logo} alt="Lyka's Car Rental" className={styles.logo} />

        <h1 className={styles.formTitle}>
          <span className={styles.gold}>Lyka's Car Rental</span> Dispatcher
        </h1>
        <p className={styles.subtitle}>Sign in to manage vehicle inspections.</p>

        {error && <p className={styles.errorText}>{error}</p>}

        <label className={styles.inputWrapper}>
          <IconMail className="authInputIcon" />
          <input
            type="email"
            placeholder="Dispatcher Email"
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
            {showPassword ? <IconEyeOff className="authToggleIcon" /> : <IconEye className="authToggleIcon" />}
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

        <p className={styles.devHint}>Dev only: dispatcher@lyka.com / dispatcher123</p>
      </form>
    </div>
  );
}