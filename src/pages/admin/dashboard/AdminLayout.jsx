import React from "react";
import AdminSidebar from "../../../components/admin/common/AdminSidebar";
import AdminTopbar from "../../../components/admin/common/AdminTopbar";
import ToastContainer from "../../../components/admin/common/ToastContainer";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }) {
  return (
    <div className={styles.page}>
      <AdminTopbar />
      <div className={styles.body}>
        <AdminSidebar />
        <main className={styles.content}>{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}