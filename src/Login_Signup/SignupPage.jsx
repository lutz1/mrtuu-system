import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SignupPage.module.css";
import logo from "../assets/logo.png"
// ---------- Icons ----------

const IconUser = () => (
  <svg
    className={styles.inputIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

const IconMail = () => (
  <svg
    className={styles.inputIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const IconLock = () => (
  <svg
    className={styles.inputIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconGoogle = () => (
  <svg className={styles.googleIcon} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11A12 12 0 0 0 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.99-3.11Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.61l3.99 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
    />
  </svg>
);

// ---------- Page ----------

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Wire this up to your auth logic
    console.log({ name, email, password });
  };

  return (
    <div className={styles.page}>
      {/* Left visual panel — same design as LoginPage */}
      <div className={styles.leftPanel}>
        <div className={styles.creamCorner} />
        <div className={styles.leftOverlay} />

        
        <div className={styles.logoWrapper}>
          <div className={styles.logoCircle}>
            <img src={logo} alt="Lyka's Car Rental" className={styles.logoImage}/>
          </div>
        </div>

        <div className={styles.headline}>
          <span className={styles.headlineLine}>Your Journey</span>
          <span className={styles.headlineHighlight}>Starts with Us.</span>
        </div>

        <div className={styles.yellowBarBottom} />
      </div>

      {/* Right form panel */}
      <div className={styles.rightPanel}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h1 className={styles.formTitle}>
            Sign Up for <span className={styles.gold}>Lyka's Car Rental</span>
          </h1>

          <label className={styles.inputWrapper}>
            <IconUser />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.inputWrapper}>
            <IconMail />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.inputWrapper}>
            <IconLock />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.inputWrapper}>
            <IconLock />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
            />
          </label>

          <button type="submit" className={styles.signupBtn}>
            Sign Up
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>OR</span>
            <span className={styles.dividerLine} />
          </div>

          <button type="button" className={styles.googleBtn}>
            <IconGoogle />
            Sign up with Google
          </button>

          <p className={styles.terms}>
            By signing up, you agree to Lyka's Car Rental
            <br />
            <a href="#terms">TERMS OF SERVICE</a> &{" "}
            <a href="#privacy">PRIVACY POLICY</a>
          </p>

          <p className={styles.loginPrompt}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}