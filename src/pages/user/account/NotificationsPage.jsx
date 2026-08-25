import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../../components/user/frontpage/Navbar";
import Breadcrumb from "../../../components/user/Breadcrumb";
import Footer from "../../../components/user/frontpage/Footer";
import AccountSidebar from "../../../components/user/account/AccountSidebar";
import NotificationCategoryCard from "../../../components/user/notification/NotificationCategoryCard";
import { NOTIFICATION_CATEGORIES } from "../../../data/notificationPreferences";
import styles from "./NotificationsPage.module.css";

export default function NotificationsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Local-only state for now — no backend write yet. Once wired up, each
  // toggle change should debounce/write to Firestore under the user's doc.
  const [categories, setCategories] = useState(NOTIFICATION_CATEGORIES);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleToggleChannel = (categoryId, channelKey, nextValue) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, channels: { ...cat.channels, [channelKey]: nextValue } }
          : cat
      )
    );
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
            <AccountSidebar onDeleteAccount={handleLogout} />

            <main className={styles.main}>
              <h1 className={styles.pageTitle}>Notifications</h1>

              <div className={styles.categoryList}>
                {categories.map((category) => (
                  <NotificationCategoryCard
                    key={category.id}
                    category={category}
                    onToggleChannel={handleToggleChannel}
                  />
                ))}
              </div>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}