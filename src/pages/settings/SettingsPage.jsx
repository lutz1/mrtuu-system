import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/frontpage/Navbar";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/frontpage/Footer";
import AccountSidebar from "../../components/account/AccountSidebar";
import SettingsSelect from "../../components/settings/SettingsSelect";
import ThemeOptionCard from "../../components/settings/ThemeOptionCard";
import ToggleSwitch from "../../components/notification/ToggleSwitch";
import {
  LANGUAGE_OPTIONS,
  CURRENCY_OPTIONS,
  PICKUP_LOCATION_OPTIONS,
  DEFAULT_SETTINGS,
} from "../../data/settingsOptions";
import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Local-only state for now — no backend write yet. Once wired up, each
  // change should write to Firestore under the user's settings doc.
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
              <h1 className={styles.pageTitle}>Settings</h1>

              <div className={styles.topGrid}>
                <section className={styles.card}>
                  <h2 className={styles.sectionTitle}>Localization</h2>
                  <div className={styles.fieldStack}>
                    <SettingsSelect
                      label="Preferred Language"
                      value={settings.language}
                      options={LANGUAGE_OPTIONS}
                      onChange={(val) => updateSetting("language", val)}
                    />
                    <SettingsSelect
                      label="Display Currency"
                      value={settings.currency}
                      options={CURRENCY_OPTIONS}
                      onChange={(val) => updateSetting("currency", val)}
                    />
                  </div>
                </section>

                <section className={styles.card}>
                  <h2 className={styles.sectionTitle}>Appearance</h2>
                  <div className={styles.themeGrid}>
                    <ThemeOptionCard
                      mode="light"
                      selected={settings.theme === "light"}
                      onSelect={(mode) => updateSetting("theme", mode)}
                    />
                    <ThemeOptionCard
                      mode="dark"
                      selected={settings.theme === "dark"}
                      onSelect={(mode) => updateSetting("theme", mode)}
                    />
                  </div>
                </section>
              </div>

              <section className={styles.card}>
                <h2 className={styles.sectionTitle}>Default Pickup</h2>

                <div className={styles.pickupField}>
                  <SettingsSelect
                    label="Pickup Location"
                    labelClassName={styles.pickupLabel}
                    value={settings.pickupLocation}
                    options={PICKUP_LOCATION_OPTIONS}
                    onChange={(val) => updateSetting("pickupLocation", val)}
                  />
                </div>

                <div className={styles.toggleRow}>
                  <ToggleSwitch
                    checked={settings.alwaysUseCurrentLocation}
                    onChange={(val) => updateSetting("alwaysUseCurrentLocation", val)}
                    label="Always use current location"
                  />
                  <span className={styles.toggleLabel}>Always use current location</span>
                </div>
              </section>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}