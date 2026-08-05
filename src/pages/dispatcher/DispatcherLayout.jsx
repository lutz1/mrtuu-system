import React from "react";
import DispatcherSidebar from "../../components/dispatcher/common/DispatcherSidebar";
import DispatcherTopbar from "../../components/dispatcher/common/DispatcherTopbar";
import ToastContainer from "../../components/admin/common/ToastContainer";
import styles from "./DispatcherLayout.module.css";

export default function DispatcherLayout({ children }) {
  return (
    <div className={styles.page}>
      <DispatcherTopbar />
      <div className={styles.body}>
        <DispatcherSidebar />
        <main className={styles.content}>{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}