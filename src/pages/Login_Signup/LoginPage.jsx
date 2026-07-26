import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import headerImage from "../../assets/header.png";
import styles from "./LoginPage.module.css";
import {
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconGoogle,
} from "../../components/icons/AuthIcons";
import "../../components/icons/authShared.css";
import OTPModal from "../../components/OTPModal";
import { detectContactType, normalizePhone } from "../../Data/phone";

function getFirebaseErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/invalid-phone-number":
      return "That phone number doesn't look right — include your country code, e.g. +63.";
    case "auth/invalid-verification-code":
      return "That code didn't match. Please try again.";
    case "auth/code-expired":
      return "That code expired. Please request a new one.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState(""); // holds email OR phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const confirmationResultRef = useRef(null);

  const { login, loginWithGoogle, sendPhoneOTP, confirmPhoneOTP } = useAuth();
  const navigate = useNavigate();

  const contactType = detectContactType(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (contactType === "email") {
        await login(email, password);
        navigate("/");
      } else {
        const phone = normalizePhone(email);
        const confirmationResult = await sendPhoneOTP(
          phone,
          "login-recaptcha-container"
        );
        confirmationResultRef.current = confirmationResult;
        setShowOTPModal(true);
      }
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (code) => {
    try {
      if (!confirmationResultRef.current) {
        throw new Error("Please request a new code and try again.");
      }
      await confirmPhoneOTP(confirmationResultRef.current, code);
      setShowOTPModal(false);
      navigate("/");
    } catch (err) {
      const message = err?.code
        ? getFirebaseErrorMessage(err)
        : err?.message || "Something went wrong. Please try again.";
      throw new Error(message);
    }
  };

  const handleResendOTP = async () => {
    const phone = normalizePhone(email);
    const confirmationResult = await sendPhoneOTP(
      phone,
      "login-recaptcha-container"
    );
    confirmationResultRef.current = confirmationResult;
  };

  const handleGoogleLogin = async () => {
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
      {/* Left visual panel */}
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
            property of Lyka's Car Rental and may not be copied, reproduced, or
            distributed without permission.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.rightPanel}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h1 className={styles.formTitle}>
            Login to <span className={styles.gold}>Lyka's Car Rental</span>
          </h1>

          {error && <p className={styles.errorText}>{error}</p>}

          <label className={styles.inputWrapper}>
            <IconMail className="authInputIcon" />
            <input
              type="text"
              placeholder="Email/Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={disabled}
              required
            />
          </label>

          {contactType === "email" && (
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
          )}

          {contactType === "phone" && (
            <p className={styles.phoneHint}>
              We'll text a 6-digit code to this number to sign you in.
            </p>
          )}

          <button type="submit" className={styles.loginBtn} disabled={disabled}>
            {isSubmitting ? (
              <>
                <span className={styles.spinner} />
                {contactType === "phone" ? "Sending code..." : "Logging in..."}
              </>
            ) : contactType === "phone" ? (
              "Send Code"
            ) : (
              "Login"
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
            onClick={handleGoogleLogin}
            disabled={disabled}
          >
            {isGoogleSubmitting ? (
              <span className={styles.spinner} />
            ) : (
              <IconGoogle className="authGoogleIcon" />
            )}
            Sign in with Google
          </button>

          <p className={styles.terms}>
            By logging in, you agree to Lyka's Car Rental
            <br />
            <a href="#terms">TERMS OF SERVICE</a> &{" "}
            <a href="#privacy">PRIVACY POLICY</a>
          </p>

          <p className={styles.signupPrompt}>
            No Account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>

      {/* Invisible reCAPTCHA anchor — required by Firebase phone auth */}
      <div id="login-recaptcha-container" />

      <OTPModal
        isOpen={showOTPModal}
        contact={email}
        contactType="phone"
        onClose={() => setShowOTPModal(false)}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
      />
    </div>
  );
}
