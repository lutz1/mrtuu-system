import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/frontpage/Navbar";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/frontpage/Footer";
import AccountSidebar from "../../components/account/AccountSidebar";
import ProfileHeaderCard from "../../components/account/ProfileHeaderCard";
import PersonalInfoCard from "../../components/account/PersonalInfoCard";
import AddressCard from "../../components/account/AddressCard";
import styles from "./AccountPage.module.css";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const cancelPersonal = () => setEditingPersonal(false);

  const saveAddress = () => {
    setAddress(addressDraft);
    setEditingAddress(false);
  };

  const cancelAddress = () => setEditingAddress(false);

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
            <AccountSidebar onDeleteAccount={handleLogout} />

            <main className={styles.main}>
              <h1 className={styles.pageTitle}>My Profile</h1>

              <ProfileHeaderCard
                user={user}
                displayName={displayName}
                email={personal.email}
                phone={personal.phone}
                onEdit={startEditingPersonal}
              />

              <PersonalInfoCard
                personal={personal}
                editingPersonal={editingPersonal}
                personalDraft={personalDraft}
                onStartEdit={startEditingPersonal}
                onDraftChange={handlePersonalDraftChange}
                onSave={savePersonal}
                onCancel={cancelPersonal}
              />

              <AddressCard
                address={address}
                editingAddress={editingAddress}
                addressDraft={addressDraft}
                onStartEdit={startEditingAddress}
                onDraftChange={handleAddressDraftChange}
                onSave={saveAddress}
                onCancel={cancelAddress}
              />
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}