import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../../components/user/frontpage/Navbar";
import Breadcrumb from "../../../components/user/Breadcrumb";
import Footer from "../../../components/user/frontpage/Footer";
import AccountSidebar from "../../../components/user/account/AccountSidebar";
import VerificationCard from "../../../components/user/security/VerificationCard";
import ChangePasswordForm from "../../../components/user/security/ChangePasswordForm";
import LoginHistoryCard from "../../../components/user/security/LoginHistoryCard";
import DangerZoneCard from "../../../components/user/security/DangerZoneCard";
import { ACTIVE_SESSIONS, SECURITY_LOG } from "../../../data/loginHistory";
import styles from "./PrivacySecurityPage.module.css";
import { useState } from "react";

function getFirebaseErrorMessage(error) {
  switch (error?.code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Current password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/requires-recent-login":
      return "Please log in again and retry — this action needs a recent sign-in.";
    case "auth/email-already-in-use":
      return "That email address is already in use by another account.";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/weak-password":
      return "New password should be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google confirmation was cancelled.";
    default:
      return error?.message || "Something went wrong. Please try again.";
  }
}

export default function PrivacySecurityPage() {
  const { user, logout, changePassword, changeEmail, deleteAccount } =
    useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState(ACTIVE_SESSIONS);

  const [emailPending, setEmailPending] = useState(false);
  const [emailNotice, setEmailNotice] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleLogoutSession = (session) => {
    // TODO: no backend session tracking yet — Firebase Auth doesn't expose
    // remote session revocation client-side; this would need a Cloud
    // Function calling admin.auth().revokeRefreshTokens(uid) per device,
    // which requires actual per-device session records server-side.
    setSessions((prev) => prev.filter((s) => s.id !== session.id));
  };

  // Prompts for the new email + current password, then kicks off Firebase's
  // verify-before-update flow (a confirmation link is sent to the NEW
  // address; the change only takes effect once that link is clicked).
  const handleChangeEmail = async () => {
    setEmailNotice("");
    const newEmail = window.prompt("Enter your new email address:", "");
    if (!newEmail) return;

    const isPasswordUser = user?.providerData?.some(
      (p) => p.providerId === "password"
    );
    const currentPassword = isPasswordUser
      ? window.prompt("Confirm your current password:", "")
      : null;

    if (isPasswordUser && !currentPassword) return;

    setEmailPending(true);
    try {
      await changeEmail(currentPassword, newEmail);
      setEmailNotice(
        `Verification link sent to ${newEmail}. Click it to finish the change.`
      );
    } catch (err) {
      setEmailNotice(getFirebaseErrorMessage(err));
    } finally {
      setEmailPending(false);
    }
  };

  // TODO: open change-phone flow, reuse sendPhoneOTP/confirmPhoneOTP
  // from AuthContext once a dedicated "update phone" UI exists
  const handleChangePhone = () => {
    console.log("Change phone number");
  };

  const handlePasswordSubmit = async ({ currentPassword, newPassword }) => {
    setPasswordNotice("");
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordNotice("Password updated successfully.");
    } catch (err) {
      setPasswordNotice(getFirebaseErrorMessage(err));
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    const isPasswordUser = user?.providerData?.some(
      (p) => p.providerId === "password"
    );
    const currentPassword = isPasswordUser
      ? window.prompt(
          "Confirm your current password to permanently delete your account:",
          ""
        )
      : null;

    if (isPasswordUser && !currentPassword) return;

    try {
      await deleteAccount(currentPassword);
      navigate("/");
    } catch (err) {
      setDeleteError(getFirebaseErrorMessage(err));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <Navbar />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.contentWrapper}>
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Showroom", to: "/showroom" },
              { label: "Profile" },
            ]}
          />

          <div className={styles.layout}>
            <AccountSidebar onLogout={handleLogout} />

            <main className={styles.main}>
              <h1 className={styles.pageTitle}>Privacy & Security</h1>

              <div className={styles.verificationGrid}>
                <VerificationCard
                  type="email"
                  value={user?.email}
                  verified={!!user?.emailVerified}
                  description={
                    emailNotice ||
                    (emailPending
                      ? "Sending verification link..."
                      : "Your email is verified. You're all set to receive booking confirmations and security notifications.")
                  }
                  onChange={handleChangeEmail}
                />
                <VerificationCard
                  type="phone"
                  value={user?.phoneNumber || "Not set"}
                  verified={!!user?.phoneNumber}
                  description="Your phone number is used for 2FA and important trip updates via SMS."
                  onChange={handleChangePhone}
                />
              </div>

              <ChangePasswordForm
                onSubmit={handlePasswordSubmit}
                statusMessage={passwordNotice}
              />

              <LoginHistoryCard
                sessions={sessions}
                securityLog={SECURITY_LOG}
                onLogoutSession={handleLogoutSession}
              />

              <DangerZoneCard
                onDeleteAccount={handleDeleteAccount}
                errorMessage={deleteError}
              />
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
