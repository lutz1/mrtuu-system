import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import styles from "./AccountPage.module.css";

const NAV_ITEMS = [
  { id: "personal", label: "Personal Info", icon: "user" },
  { id: "bookings", label: "My Bookings", icon: "bookmark" },
  { id: "payment", label: "Payment Methods", icon: "card" },
  { id: "notifications", label: "Notification", icon: "bell" },
  { id: "settings", label: "Settings", icon: "gear" },
  { id: "security", label: "Security", icon: "shield" },
];

function NavIcon({ name }) {
  switch (name) {
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "bookmark":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    case "card":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "gear":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M19.4 13a7.9 7.9 0 0 0 0-2l2-1.5-2-3.4-2.3.9a8 8 0 0 0-1.7-1L15 3.6h-4l-.4 2.4a8 8 0 0 0-1.7 1l-2.3-.9-2 3.4L6.6 11a7.9 7.9 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9a8 8 0 0 0 1.7 1l.4 2.4h4l.4-2.4a8 8 0 0 0 1.7-1l2.3.9 2-3.4-2-1.5z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    case "trash":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("personal");

  const fullName = user?.displayName || "";
  const [firstName, ...restName] = fullName.split(" ");
  const derivedLastName = restName.join(" ");

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

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const displayName =
    `${personal.firstName} ${personal.lastName}`.trim() ||
    (user?.email ? user.email.split("@")[0] : "Account");
  const initial = displayName.trim().charAt(0).toUpperCase();

  const handlePersonalChange = (field, value) => {
    setPersonal((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const savePersonal = () => {
    // No backend yet — this only persists in local state for now
    setEditingPersonal(false);
  };

  const saveAddress = () => {
    // No backend yet — this only persists in local state for now
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
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <nav className={styles.sidebarNav}>
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.sidebarItem} ${
                      activeSection === item.id ? styles.sidebarItemActive : ""
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span className={styles.sidebarIcon}>
                      <NavIcon name={item.icon} />
                    </span>
                    {item.label}
                  </button>
                ))}

                <div className={styles.sidebarDivider} />

                <button
                  type="button"
                  className={styles.sidebarItemDanger}
                  onClick={handleLogout}
                >
                  <span className={styles.sidebarIcon}>
                    <NavIcon name="trash" />
                  </span>
                  Delete Account
                </button>
              </nav>
            </aside>

            {/* Main content */}
            <main className={styles.main}>
              <h1 className={styles.pageTitle}>My Profile</h1>

              {/* Profile header card */}
              <section className={styles.card}>
                <div className={styles.profileHeader}>
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={displayName} className={styles.avatarImage} />
                  ) : (
                    <div className={styles.avatar}>{initial}</div>
                  )}

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

                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={() => setEditingPersonal(true)}
                  >
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
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => setEditingPersonal(true)}
                    >
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
                        value={personal.firstName}
                        onChange={(e) => handlePersonalChange("firstName", e.target.value)}
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
                        value={personal.lastName}
                        onChange={(e) => handlePersonalChange("lastName", e.target.value)}
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
                        value={personal.phone}
                        onChange={(e) => handlePersonalChange("phone", e.target.value)}
                      />
                    ) : (
                      <span className={styles.fieldValue}>{personal.phone || "Not set"}</span>
                    )}
                  </div>
                </div>

                {editingPersonal && (
                  <div className={styles.editActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setEditingPersonal(false)}
                    >
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
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => setEditingAddress(true)}
                    >
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
                        value={address.country}
                        onChange={(e) => handleAddressChange("country", e.target.value)}
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
                        value={address.city}
                        onChange={(e) => handleAddressChange("city", e.target.value)}
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
                        value={address.postalCode}
                        onChange={(e) => handleAddressChange("postalCode", e.target.value)}
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
                        value={address.province}
                        onChange={(e) => handleAddressChange("province", e.target.value)}
                      />
                    ) : (
                      <span className={styles.fieldValue}>{address.province || "Not set"}</span>
                    )}
                  </div>
                </div>

                {editingAddress && (
                  <div className={styles.editActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setEditingAddress(false)}
                    >
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