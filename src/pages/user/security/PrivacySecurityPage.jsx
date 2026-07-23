import React, { useState } from "react";
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

// TODO: open change-email flow (needs a new AuthContext function —
// Firebase's updateEmail() requires recent re-authentication)
const handleChangeEmail = () => {
  console.log("Change email address");
};

// TODO: open change-phone flow, reuse sendPhoneOTP/confirmPhoneOTP
// from AuthContext once a dedicated "update phone" UI exists
const handleChangePhone = () => {
  console.log("Change phone number");
};

// TODO: needs a changePassword function in AuthContext.
// Firebase requires reauthenticateWithCredential(currentPassword)
// before updatePassword(newPassword) will succeed.
const handlePasswordSubmit = ({ currentPassword, newPassword }) => {
  console.log("Change password:", { currentPassword, newPassword });
};

// TODO: needs a deleteAccount function in AuthContext using
// Firebase's deleteUser(), which also requires recent re-auth.
const handleDeleteAccount = () => {
  console.log("Delete account requested");
};

export default function PrivacySecurityPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState(ACTIVE_SESSIONS);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoutSession = (session) => {
    // TODO: no backend session tracking yet — Firebase Auth doesn't expose
    // remote session revocation client-side; this would need a Cloud
    // Function calling admin.auth().revokeRefreshTokens(uid) per device,
    // which requires actual per-device session records server-side.
    setSessions((prev) => prev.filter((s) => s.id !== session.id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <Navbar />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.contentWrapper}>
          <Breadcrumb
            items={[{ label: "Home", to: "/" }, { label: "Showroom", to: "/showroom" }, { label: "Profile" }]}
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
                  description="Your email is verified. You're all set to receive booking confirmations and security notifications."
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

              <ChangePasswordForm onSubmit={handlePasswordSubmit} />

              <LoginHistoryCard
                sessions={sessions}
                securityLog={SECURITY_LOG}
                onLogoutSession={handleLogoutSession}
              />

              <DangerZoneCard onDeleteAccount={handleDeleteAccount} />
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}