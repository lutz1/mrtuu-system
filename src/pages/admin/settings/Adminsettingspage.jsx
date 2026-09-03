import { useEffect, useRef, useState } from "react";
import AdminLayout from "../dashboard/AdminLayout";
import { useToast } from "../../../context/ToastContext";
import styles from "./AdminSettingsPage.module.css";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
import { useStaff } from "../../../context/StaffContext";

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 8.5a2 2 0 0 1 2-2h1.2l1-1.5h7.6l1 1.5H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12.5"
        r="3.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4.5 6.5l7.5 6 7.5-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C10.7 19.5 4.5 13.3 4.5 6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 3v3.5M16 3v3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RoleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M6.5 15.5c.5-1.2 1.4-1.8 2.5-1.8s2 .6 2.5 1.8M14.5 10h3M14.5 13h3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="5"
        y="10.5"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 5h11l3 3v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 5v5h7V5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Matches the roles defined in DEFAULT_PERMISSIONS (StaffContext).
// Any role not listed here still gets a readable label automatically
// via humanizeRole(), so a new role added later won't show up blank.
const ROLE_LABELS = {
  owner: "Owner",
  staff: "Staff",
  dispatcher: "Dispatcher",
  checklist_admin: "Checklist Admin",
};

function humanizeRole(role) {
  if (!role) return "—";
  if (ROLE_LABELS[role]) return ROLE_LABELS[role];
  return role
    .split(/[_-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AdminSettingsPage() {
  const { user, refreshUser, changePassword } = useAuth();
  const { staffProfile } = useStaff();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.displayName || "");
  const [contactPhone, setContactPhone] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Load the free-text contactPhone field from users/{uid} on mount.
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid))
      .then((snap) => {
        if (snap.exists()) setContactPhone(snap.data().contactPhone || "");
      })
      .catch((err) => console.error("Failed to load profile:", err));
  }, [user]);

  useEffect(() => {
    setFullName(user?.displayName || "");
  }, [user?.displayName]);

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingPhoto(true);
    try {
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      const { updateProfile } = await import("firebase/auth");
      await updateProfile(user, { photoURL });
      await setDoc(
        doc(db, "users", user.uid),
        { photoURL, lastLoginAt: serverTimestamp() },
        { merge: true }
      );
      refreshUser();
      showToast("Profile photo updated.", { type: "success" });
    } catch (err) {
      console.error(err);
      showToast("Could not upload photo. Please try again.", {
        type: "error",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const updatePasswordField = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    const wantsPasswordChange = passwords.next || passwords.confirm;
    if (wantsPasswordChange && passwords.next !== passwords.confirm) {
      showToast("New password and confirmation don't match.", {
        type: "error",
      });
      return;
    }
    if (wantsPasswordChange && isPasswordUser && !passwords.current) {
      showToast("Enter your current password to continue.", {
        type: "error",
      });
      return;
    }

    setSaving(true);
    try {
      const { updateProfile } = await import("firebase/auth");
      if (fullName !== user.displayName) {
        await updateProfile(user, { displayName: fullName });
        refreshUser();
      }
      await setDoc(
        doc(db, "users", user.uid),
        { contactPhone, lastLoginAt: serverTimestamp() },
        { merge: true }
      );

      if (wantsPasswordChange) {
        await changePassword(passwords.current, passwords.next);
        setPasswords({ current: "", next: "", confirm: "" });
      }

      showToast("Settings saved.", { type: "success" });
    } catch (err) {
      console.error(err);
      showToast(err.message || "Could not save changes.", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Google-only accounts have no password on file — changePassword()
  // re-authenticates via a Google popup for them instead, so the
  // "Current Password" field is only relevant for password-provider users.
  const isPasswordUser =
    user?.providerData?.some((p) => p.providerId === "password") ?? false;

  const roleLabel = humanizeRole(staffProfile?.role);
  const initial = (user?.displayName || "A").trim().charAt(0).toUpperCase();
  const displayFirstName = (user?.displayName || "Admin").split(" ")[0];
  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>
          Manage your account information and security.
        </p>
      </div>

      <form className={styles.grid} onSubmit={handleSave}>
        <section className={styles.summaryCard}>
          <div className={styles.avatarWrap}>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className={styles.avatarImage}
              />
            ) : (
              <span className={styles.avatarFallback}>{initial}</span>
            )}
            <button
              type="button"
              className={styles.cameraBtn}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Change photo"
              disabled={uploadingPhoto}
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
          <span className={styles.roleBadge}>{roleLabel}</span>

          <div className={styles.detailsList}>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <MailIcon />
              </span>
              <div>
                <p className={styles.detailLabel}>Email</p>
                <p className={styles.detailValue}>{user?.email}</p>
              </div>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <PhoneIcon />
              </span>
              <div>
                <p className={styles.detailLabel}>Phone</p>
                <p className={styles.detailValue}>
                  {contactPhone || "Not set"}
                </p>
              </div>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <CalendarIcon />
              </span>
              <div>
                <p className={styles.detailLabel}>Member Since</p>
                <p className={styles.detailValue}>{memberSince}</p>
              </div>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <RoleIcon />
              </span>
              <div>
                <p className={styles.detailLabel}>Role</p>
                <p className={styles.detailValue}>{roleLabel}</p>
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.lockedField}>
                {user?.email}
                <LockIcon />
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="text"
                className={styles.input}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Role</label>
              <div className={styles.lockedField}>
                {roleLabel}
                <LockIcon />
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <h2 className={styles.sectionTitle}>Change Password</h2>

          {!isPasswordUser && (
            <p className={styles.helperNote}>
              Your account signs in with Google. You'll be asked to confirm
              via a Google popup before the new password is saved.
            </p>
          )}

          <div className={styles.row}>
            {isPasswordUser && (
              <div className={styles.field}>
                <label className={styles.label}>Current Password</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Enter current password"
                  value={passwords.current}
                  onChange={(e) =>
                    updatePasswordField("current", e.target.value)
                  }
                />
              </div>
            )}
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
              onChange={(e) =>
                updatePasswordField("confirm", e.target.value)
              }
            />
          </div>

          <div className={styles.actionsRow}>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
              <SaveIcon />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>
      </form>
    </AdminLayout>
  );
}