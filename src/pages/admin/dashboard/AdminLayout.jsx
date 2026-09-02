import { useState, useEffect } from "react";
import AdminSidebar from "../../../components/admin/common/AdminSidebar";
import AdminTopbar from "../../../components/admin/common/AdminTopbar";
import ToastContainer from "../../../components/admin/common/ToastContainer";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("adminSidebarCollapsed") === "true"
  );
  const [isDesktop, setIsDesktop] = useState(true);

  // Collapsing only makes sense on the fixed-width desktop/tablet sidebar,
  // not the mobile drawer — mirrors the breakpoint AdminSidebar.module.css
  // uses to switch into drawer mode.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const effectiveCollapsed = collapsed && isDesktop;

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("adminSidebarCollapsed", String(next));
      return next;
    });
  };

  return (
    <div
      className={`${styles.page} ${
        effectiveCollapsed ? styles.sidebarCollapsed : ""
      }`}
    >
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
          isCollapsed={effectiveCollapsed}
          onToggleCollapse={toggleCollapsed}
        />

        <main className={styles.content}>
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}