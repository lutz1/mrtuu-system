import React from "react";
import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import UserRowActions from "./UserRowActions";
import styles from "./UserTable.module.css";

export default function UserTable({ users, onToggleStatus }) {
  if (users.length === 0) {
    return <div className={styles.empty}>No users match your search or filters.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className={styles.userId}>{user.id}</td>
              <td className={styles.name}>{user.name}</td>
              <td className={styles.cell}>{user.email}</td>
              <td>
                <UserRoleBadge role={user.role} />
              </td>
              <td>
                <UserStatusBadge status={user.status} />
              </td>
              <td className={styles.cell}>{user.lastLogin}</td>
              <td>
                <UserRowActions user={user} onToggleStatus={onToggleStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}