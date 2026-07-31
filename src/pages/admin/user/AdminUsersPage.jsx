import { useMemo, useState } from "react";
import AdminLayout from "../dashboard/AdminLayout";
import UserStatCard from "../../../components/admin/user/UserStatCard";
import UserFilterBar from "../../../components/admin/user/UserFilterBar";
import UserTable from "../../../components/admin/user/UserTable";
import Pagination from "../../../components/admin/common/Pagination";
import { useStaffDirectory } from "../../../context/useStaffDirectory";
import { useStaff } from "../../../context/StaffContext";
import styles from "./AdminUsersPage.module.css";

const PAGE_SIZE = 10;

function TotalUsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.5" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M2.5 19c1-3.4 3.2-5 6-5s5 1.6 6 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15 6a3 3 0 0 1 0 6M17 19c-.4-2-1.4-3.6-2.8-4.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function OwnerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="12"
        cy="8.5"
        r="3.2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5.5 19c1.1-3.7 3.5-5.4 6.5-5.4s5.4 1.7 6.5 5.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function DispatcherIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminUsersPage() {
  const { staffProfile } = useStaff();
  const {
    staffList,
    loading,
    addStaffByEmail,
    updateStaff,
    toggleActive,
    deleteStaff,
  } = useStaffDirectory();

  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  // TODO: frontend to provide the actual Add/Edit Staff modal component.
  // These flags + handler functions below are wired and ready to hook up —
  // swap the console.log calls for real modal open/submit once it exists.
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return staffList.filter((u) => {
      const matchesQuery =
        q === "" ||
        (u.displayName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);
      const matchesRole = role === "All Roles" || u.role === role;
      const matchesStatus =
        status === "All Status" || (status === "Active" ? u.active : !u.active);
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [staffList, query, role, status]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const makeFilterHandler = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleToggleStatus = async (staffMember) => {
    if (staffMember.uid === staffProfile?.uid) return; // self-lockout guard
    try {
      await toggleActive(staffMember.uid, !staffMember.active);
    } catch (err) {
      console.error("Failed to toggle staff status:", err);
    }
  };

  const handleDelete = async (staffMember) => {
    if (staffProfile?.role !== "owner") return;
    if (staffMember.uid === staffProfile?.uid) return; // can't delete self
    try {
      await deleteStaff(staffMember.uid);
    } catch (err) {
      console.error("Failed to delete staff member:", err);
    }
  };

  const handleOpenAdd = () => {
    // TODO: open real "Add Staff" modal once it exists.
    // Expected submit shape: addStaffByEmail(email, role, permissions)
    console.log("Open Add Staff modal — pending frontend component");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (staffMember) => {
    // TODO: open real "Edit Staff" modal once it exists.
    // Expected submit shape: updateStaff(uid, { role, permissions })
    console.log(
      "Open Edit Staff modal for",
      staffMember.uid,
      "— pending frontend component"
    );
    setEditingStaff(staffMember);
  };

  const ownerCount = staffList.filter((u) => u.role === "owner").length;
  const dispatcherCount = staffList.filter(
    (u) => u.role === "dispatcher"
  ).length;

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Users</h1>
      </div>

      <div className={styles.statsGrid}>
        <UserStatCard
          icon={<TotalUsersIcon />}
          label="Total Staff"
          value={staffList.length}
        />
        <UserStatCard icon={<OwnerIcon />} label="Owners" value={ownerCount} />
        <UserStatCard
          icon={<DispatcherIcon />}
          label="Dispatchers"
          value={dispatcherCount}
        />
      </div>

      <div className={styles.filterWrap}>
        <UserFilterBar
          query={query}
          onQueryChange={makeFilterHandler(setQuery)}
          role={role}
          onRoleChange={makeFilterHandler(setRole)}
          status={status}
          onStatusChange={makeFilterHandler(setStatus)}
          onAddUser={handleOpenAdd}
        />
      </div>

      {loading ? (
        <p>Loading staff...</p>
      ) : (
        <UserTable
          users={pageItems}
          currentUid={staffProfile?.uid}
          currentRole={staffProfile?.role}
          onEdit={handleOpenEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="users"
      />

      {/* TODO: <AddStaffModal open={isAddModalOpen} onClose={...} onSubmit={addStaffByEmail} /> */}
      {/* TODO: <EditStaffModal staff={editingStaff} onClose={...} onSubmit={updateStaff} /> */}
    </AdminLayout>
  );
}
