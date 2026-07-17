import React, { useEffect, useRef, useState } from "react";
import styles from "./OTPModal.module.css";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OTPModal({
  isOpen,
  contact,
  contactType, // "phone" | "email"
  onClose,
  onVerify,
  onResend,
}) {
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) return;
    setDigits(Array(CODE_LENGTH).fill(""));
    setSecondsLeft(RESEND_SECONDS);
    setError("");
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, secondsLeft]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    setError("");

    if (clean && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < CODE_LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setIsVerifying(true);
    try {
      await onVerify?.(code);
    } catch (err) {
      setError(err?.message || "That code didn't work. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    setDigits(Array(CODE_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    try {
      await onResend?.();
    } catch (err) {
      setError(err?.message || "Couldn't resend the code. Please try again.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className={styles.iconCircle}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {contactType === "phone" ? (
              <path
                d="M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <>
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </>
            )}
          </svg>
        </div>

        <h2 className={styles.title}>Verify your {contactType === "phone" ? "phone number" : "email"}</h2>
        <p className={styles.subtitle}>
          We sent a 6-digit code to <strong>{contact}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.codeRow} onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={styles.codeInput}
                disabled={isVerifying}
              />
            ))}
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.verifyBtn} disabled={isVerifying}>
            {isVerifying ? (
              <>
                <span className={styles.spinner} />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </button>
        </form>

        <p className={styles.resendRow}>
          {secondsLeft > 0 ? (
            <span className={styles.resendMuted}>Resend code in {secondsLeft}s</span>
          ) : (
            <button type="button" className={styles.resendBtn} onClick={handleResend}>
              Resend code
            </button>
          )}
        </p>
      </div>
    </div>
  );
}