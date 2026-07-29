import React, { useMemo, useState } from "react";
import AdminLayout from "../dashboard/AdminLayout";
import UserStatCard from "../../../components/admin/user/UserStatCard";
import UserFilterBar from "../../../components/admin/user/UserFilterBar";
import UserTable from "../../../components/admin/user/UserTable";
import Pagination from "../../../components/admin/common/Pagination";
import { MOCK_USERS } from "../../../data/admin/mockUsers";
import styles from "./AdminUsersPage.module.css";

const PAGE_SIZE = 10;

function TotalUsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.5" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 19c1-3.4 3.2-5 6-5s5 1.6 6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 6a3 3 0 0 1 0 6M17 19c-.4-2-1.4-3.6-2.8-4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 19c1.1-3.7 3.5-5.4 6.5-5.4s5.4 1.7 6.5 5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="9.8" y="6.3" width="4.4" height="3.4" rx="0.8" fill="#ffffff" />
      <path d="M10.3 6.3v-.7a1.7 1.7 0 0 1 3.4 0v.7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function DispatcherIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQuery =
        q === "" ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);
      const matchesRole = role === "All Roles" || u.role === role;
      const matchesStatus = status === "All Status" || u.status === status;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, role, status]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const makeFilterHandler = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleToggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u))
    );
  };

  // TODO: wire to a real add-user form once it exists
  const handleAddUser = () => {
    console.log("Add user clicked");
  };

  const adminCount = users.filter((u) => u.role === "Admin").length;
  const dispatcherCount = users.filter((u) => u.role === "Dispatcher").length;

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Users</h1>
      </div>

      <div className={styles.statsGrid}>
        <UserStatCard icon={<TotalUsersIcon />} label="Total Users" value={users.length} />
        <UserStatCard icon={<AdminIcon />} label="Administrator" value={adminCount} />
        <UserStatCard icon={<DispatcherIcon />} label="Dispatchers" value={dispatcherCount} />
      </div>

      <div className={styles.filterWrap}>
        <UserFilterBar
          query={query}
          onQueryChange={makeFilterHandler(setQuery)}
          role={role}
          onRoleChange={makeFilterHandler(setRole)}
          status={status}
          onStatusChange={makeFilterHandler(setStatus)}
          onAddUser={handleAddUser}
        />
      </div>

      <UserTable users={pageItems} onToggleStatus={handleToggleStatus} />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="users"
      />
    </AdminLayout>
  );
}