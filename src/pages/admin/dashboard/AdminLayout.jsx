import React, { useState } from "react";
import AdminSidebar from "../../../components/admin/common/AdminSidebar";
import AdminTopbar from "../../../components/admin/common/AdminTopbar";
import ToastContainer from "../../../components/admin/common/ToastContainer";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.page}>
      <AdminTopbar onMenuClick={openSidebar} />

      {/* Mobile sidebar overlay */}
      <div
        className={`${styles.overlay} ${
          sidebarOpen ? styles.overlayVisible : ""
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <div className={styles.body}>
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className={styles.content}>
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}