import React, { useEffect, useState } from "react";
import styles from "./OTPModal.module.css";

const RESEND_SECONDS = 30;

export default function EmailVerificationModal({ isOpen, email, onClose, onResend, onCheckVerified, onVerified }) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(RESEND_SECONDS);
    setResent(false);
    setError("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, secondsLeft]);

  if (!isOpen) return null;

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    await onResend?.();
    setResent(true);
    setSecondsLeft(RESEND_SECONDS);
  };

 const handleCheckVerified = async () => {
    setError("");
    setIsChecking(true);
    try {
      const isVerified = await onCheckVerified?.();
      if (isVerified) {
        onVerified?.();
      } else {
        setError("We haven't seen that yet — click the link in your email, then try again.");
      }
    } catch (err) {
      setError("Something went wrong checking your verification status.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className={styles.iconCircle}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className={styles.title}>Verify your email</h2>
        <p className={styles.subtitle}>
          We sent a verification link to <strong>{email}</strong>. Click the link
          in that email, then come back here and continue.
        </p>

        {resent && <p className={styles.resentNote}>Verification email resent.</p>}
        {error && <p className={styles.errorText}>{error}</p>}

        <button type="button" className={styles.verifyBtn} onClick={handleCheckVerified} disabled={isChecking}>
          {isChecking ? (
            <>
              <span className={styles.spinner} />
              Checking...
            </>
          ) : (
            "I've verified — Continue"
          )}
        </button>

        <p className={styles.resendRow}>
          {secondsLeft > 0 ? (
            <span className={styles.resendMuted}>Resend email in {secondsLeft}s</span>
          ) : (
            <button type="button" className={styles.resendBtn} onClick={handleResend}>
              Resend email
            </button>
          )}
        </p>
      </div>
    </div>
  );
}