import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import headerImage from "../../assets/header.png";
import styles from "./SignupPage.module.css";
import { IconUser, IconMail, IconLock, IconEye, IconEyeOff, IconGoogle } from "../../components/icons/AuthIcons";
import "../../components/icons/authShared.css";

function getFirebaseErrorMessage(error) {
  switch (error?.code) {
    case "auth/email-already-in-use":
      return "An account already exists with that email.";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-up was cancelled.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      navigate("/");
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const disabled = isSubmitting || isGoogleSubmitting;

  return (
    <div className={styles.page}>
      {/* Left visual panel — same design as LoginPage */}
      <div className={styles.leftPanel}>
        <div
          className={styles.leftImage}
          style={{ backgroundImage: `url(${headerImage})` }}
        />
        <div className={styles.leftOverlay} />

        <img src={logo} alt="Lyka's Car Rental" className={styles.logoTop} />

        <div className={styles.leftBottom}>
          <p className={styles.brandLabel}>Lyka's Car Rental</p>
          <h2 className={styles.headline}>
            <span className={styles.headlineGold}>Your Journey</span>
            <span className={styles.headlineCream}>Starts with Us.</span>
          </h2>

          <p className={styles.legalText}>
            © 2026 Lyka's Car Rental. All Rights Reserved.
            <br />
            All content, images, logos, and materials on this website are the
            property of Lyka's Car Rental and may not be copied, reproduced,
            or distributed without permission.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.rightPanel}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h1 className={styles.formTitle}>
            Sign Up for <span className={styles.gold}>Lyka's Car Rental</span>
          </h1>

          {error && <p className={styles.errorText}>{error}</p>}

          <label className={styles.inputWrapper}>
            <IconUser className="authInputIcon" />
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              disabled={disabled}
              required
            />
          </label>

          <label className={styles.inputWrapper}>
            <IconMail className="authInputIcon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={disabled}
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
              disabled={disabled}
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

          <label className={styles.inputWrapper}>
            <IconLock className="authInputIcon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              disabled={disabled}
              required
            />
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <IconEyeOff className="authToggleIcon" />
              ) : (
                <IconEye className="authToggleIcon" />
              )}
            </button>
          </label>

          <button type="submit" className={styles.signupBtn} disabled={disabled}>
            {isSubmitting ? (
              <>
                <span className={styles.spinner} />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>OR</span>
            <span className={styles.dividerLine} />
          </div>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleSignup}
            disabled={disabled}
          >
            {isGoogleSubmitting ? (
              <span className={styles.spinner} />
            ) : (
              <IconGoogle className="authGoogleIcon" />
            )}
            Sign up with Google
          </button>

          <p className={styles.terms}>
            By signing up, you agree to Lyka's Car Rental
            <br />
            <a href="#terms">TERMS OF SERVICE</a> & <a href="#privacy">PRIVACY POLICY</a>
          </p>

          <p className={styles.loginPrompt}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}