import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import AccountSidebar from "../../components/AccountSidebar";
import ProfilePictureUpload from "../../components/ProfilePictureUpload";
import styles from "./AccountPage.module.css";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("personal");

  const fullName = user?.displayName || "";
  const [firstName, ...restName] = fullName.split(" ");
  const derivedLastName = restName.join(" ");

  // Committed (saved) values — these are what render when not editing
  const [personal, setPersonal] = useState({
    firstName: firstName || "",
    lastName: derivedLastName || "",
    email: user?.email || "",
    phone: "",
  });

  const [address, setAddress] = useState({
    country: "",
    city: "",
    postalCode: "",
    province: "",
  });

  // Draft values — only these change while typing in edit mode
  const [personalDraft, setPersonalDraft] = useState(personal);
  const [addressDraft, setAddressDraft] = useState(address);

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const displayName =
    `${personal.firstName} ${personal.lastName}`.trim() ||
    (user?.email ? user.email.split("@")[0] : "Account");

  const startEditingPersonal = () => {
    setPersonalDraft(personal);
    setEditingPersonal(true);
  };

  const startEditingAddress = () => {
    setAddressDraft(address);
    setEditingAddress(true);
  };

  const handlePersonalDraftChange = (field, value) => {
    setPersonalDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressDraftChange = (field, value) => {
    setAddressDraft((prev) => ({ ...prev, [field]: value }));
  };

  const savePersonal = () => {
    setPersonal(personalDraft);
    setEditingPersonal(false);
  };

  const cancelPersonal = () => {
    setEditingPersonal(false);
  };

  const saveAddress = () => {
    setAddress(addressDraft);
    setEditingAddress(false);
  };

  const cancelAddress = () => {
    setEditingAddress(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <Navbar />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.contentWrapper}>
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "My Profile" }]} />

          <div className={styles.layout}>
            <AccountSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onDeleteAccount={handleLogout}
            />

            <main className={styles.main}>
              <h1 className={styles.pageTitle}>My Profile</h1>

              {/* Profile header card */}
              <section className={styles.card}>
                <div className={styles.profileHeader}>
                  <ProfilePictureUpload
                    photoURL={user?.photoURL}
                    displayName={displayName}
                  />

                  <div className={styles.profileInfo}>
                    <h2 className={styles.profileName}>{displayName}</h2>
                    <p className={styles.profileLine}>
                      <span className={styles.profileLabel}>Email</span> {personal.email || "—"}
                    </p>
                    <p className={styles.profileLine}>
                      <span className={styles.profileLabel}>Phone</span>{" "}
                      {personal.phone || "Not set"}
                    </p>
                  </div>

                  <button type="button" className={styles.editBtn} onClick={startEditingPersonal}>
                    Edit
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 20h4l10-10-4-4L4 16v4z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </section>

              {/* Personal Information */}
              <section className={styles.card}>
                <div className={styles.cardHeaderRow}>
                  <h3 className={styles.cardTitle}>Personal Information</h3>
                  {!editingPersonal && (
                    <button type="button" className={styles.editBtn} onClick={startEditingPersonal}>
                      Edit
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4 20h4l10-10-4-4L4 16v4z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Name</span>
                    {editingPersonal ? (
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={personalDraft.firstName}
                        onChange={(e) => handlePersonalDraftChange("firstName", e.target.value)}
                      />
                    ) : (
                      <span className={styles.fieldValue}>{personal.firstName || "—"}</span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Last Name</span>
                    {editingPersonal ? (
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={personalDraft.lastName}
                        onChange={(e) => handlePersonalDraftChange("lastName", e.target.value)}
                      />
                    ) : (
                      <span className={styles.fieldValue}>{personal.lastName || "—"}</span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Email Address</span>
                    <span className={styles.fieldValue}>{personal.email || "—"}</span>
                  </div>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Phone</span>
                    {editingPersonal ? (
                      <input
                        type="tel"
                        className={styles.fieldInput}
                        placeholder="e.g. 0967676767"
                        value={personalDraft.phone}
                        onChange={(e) => handlePersonalDraftChange("phone", e.target.value)}
                      />
                    ) : (
                      <span className={styles.fieldValue}>{personal.phone || "Not set"}</span>
                    )}
                  </div>
                </div>

                {editingPersonal && (
                  <div className={styles.editActions}>
                    <button type="button" className={styles.cancelBtn} onClick={cancelPersonal}>
                      Cancel
                    </button>
                    <button type="button" className={styles.saveBtn} onClick={savePersonal}>
                      Save Changes
                    </button>
                  </div>
                )}
              </section>

              {/* Address */}
              <section className={styles.card}>
                <div className={styles.cardHeaderRow}>
                  <h3 className={styles.cardTitle}>Address</h3>
                  {!editingAddress && (
                    <button type="button" className={styles.editBtn} onClick={startEditingAddress}>
                      Edit
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4 20h4l10-10-4-4L4 16v4z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Country</span>
                    {editingAddress ? (
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={addressDraft.country}
                        onChange={(e) => handleAddressDraftChange("country", e.target.value)}
                      />
                    ) : (
                      <span className={styles.fieldValue}>{address.country || "Not set"}</span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>City</span>
                    {editingAddress ? (
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={addressDraft.city}
                        onChange={(e) => handleAddressDraftChange("city", e.target.value)}
                      />
                    ) : (
                      <span className={styles.fieldValue}>{address.city || "Not set"}</span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Postal Code</span>
                    {editingAddress ? (
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={addressDraft.postalCode}
                        onChange={(e) => handleAddressDraftChange("postalCode", e.target.value)}
                      />
                    ) : (
                      <span className={styles.fieldValue}>{address.postalCode || "Not set"}</span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Province</span>
                    {editingAddress ? (
                      <input
                        type="text"
                        className={styles.fieldInput}
                        value={addressDraft.province}
                        onChange={(e) => handleAddressDraftChange("province", e.target.value)}
                      />
                    ) : (
                      <span className={styles.fieldValue}>{address.province || "Not set"}</span>
                    )}
                  </div>
                </div>

                {editingAddress && (
                  <div className={styles.editActions}>
                    <button type="button" className={styles.cancelBtn} onClick={cancelAddress}>
                      Cancel
                    </button>
                    <button type="button" className={styles.saveBtn} onClick={saveAddress}>
                      Save Changes
                    </button>
                  </div>
                )}
              </section>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}