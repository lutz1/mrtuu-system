import React from "react";
import AdminSidebar from "../../../components/admin/dashboard/AdminSidebar";
import AdminTopbar from "../../../components/admin/dashboard/AdminTopbar";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }) {
  return (
    <div className={styles.page}>
      <AdminTopbar />
      <div className={styles.body}>
        <AdminSidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}