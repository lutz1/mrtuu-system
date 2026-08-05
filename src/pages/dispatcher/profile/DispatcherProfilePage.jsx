import React, { useEffect, useRef, useState } from "react";
import DispatcherLayout from "../DispatcherLayout";
import { useToast } from "../../../context/ToastContext";
import styles from "./DispatcherProfilePage.module.css";

// TODO: mock profile data — replace with real dispatcher account data
// once the admin/dispatcher data layer exists. Nothing here persists
// beyond this session.
const INITIAL_PROFILE = {
  fullName: "Selsite Tortskie",
  email: "tortskie@gmail.com",
  phone: "09957463523",
  role: "Dispatcher",
  memberSince: "May 10, 2026",
};

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8.5a2 2 0 0 1 2-2h1.2l1-1.5h7.6l1 1.5H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 6.5l7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C10.7 19.5 4.5 13.3 4.5 6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function RoleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.5 15.5c.5-1.2 1.4-1.8 2.5-1.8s2 .6 2.5 1.8M14.5 10h3M14.5 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="10.5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function DispatcherProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  };

  const updateProfileField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updatePasswordField = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (passwords.next || passwords.confirm || passwords.current) {
      if (passwords.next !== passwords.confirm) {
        showToast("New password and confirmation don't match.", { type: "error" });
        return;
      }
    }
    // TODO: not wired to any backend — nothing here actually persists
    showToast("Profile changes saved.", { type: "success" });
    setPasswords({ current: "", next: "", confirm: "" });
  };

  const initial = profile.fullName.trim().charAt(0).toUpperCase();
  const displayFirstName = profile.fullName.split(" ")[0];

  return (
    <DispatcherLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.subtitle}>View and update your account information.</p>
      </div>

      <form className={styles.grid} onSubmit={handleSave}>
        <section className={styles.summaryCard}>
          <div className={styles.avatarWrap}>
            {photoPreviewUrl ? (
              <img src={photoPreviewUrl} alt={profile.fullName} className={styles.avatarImage} />
            ) : (
              <span className={styles.avatarFallback}>{initial}</span>
            )}
            <button
              type="button"
              className={styles.cameraBtn}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Change photo"
            >
              <CameraIcon />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handlePhotoSelect}
            />
          </div>

          <h2 className={styles.displayName}>{displayFirstName}</h2>
          <span className={styles.roleBadge}>{profile.role}</span>

          <div className={styles.detailsList}>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <MailIcon />
              </span>
              <div>
                <p className={styles.detailLabel}>Email</p>
                <p className={styles.detailValue}>{profile.email}</p>
              </div>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <PhoneIcon />
              </span>
              <div>
                <p className={styles.detailLabel}>Phone</p>
                <p className={styles.detailValue}>{profile.phone}</p>
              </div>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <CalendarIcon />
              </span>
              <div>
                <p className={styles.detailLabel}>Member Since</p>
                <p className={styles.detailValue}>{profile.memberSince}</p>
              </div>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <RoleIcon />
              </span>
              <div>
                <p className={styles.detailLabel}>Role</p>
                <p className={styles.detailValue}>{profile.role}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={styles.input}
                value={profile.fullName}
                onChange={(e) => updateProfileField("fullName", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={styles.input}
                value={profile.email}
                onChange={(e) => updateProfileField("email", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="text"
                className={styles.input}
                value={profile.phone}
                onChange={(e) => updateProfileField("phone", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Role</label>
              <div className={styles.lockedField}>
                {profile.role}
                <LockIcon />
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <h2 className={styles.sectionTitle}>Change Password</h2>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Current Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Enter current password"
                value={passwords.current}
                onChange={(e) => updatePasswordField("current", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Enter new password"
                value={passwords.next}
                onChange={(e) => updatePasswordField("next", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={(e) => updatePasswordField("confirm", e.target.value)}
            />
          </div>

          <div className={styles.actionsRow}>
            <button type="submit" className={styles.saveBtn}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5h11l3 3v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M8 5v5h7V5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              Save Changes
            </button>
          </div>
        </section>
      </form>
    </DispatcherLayout>
  );
}