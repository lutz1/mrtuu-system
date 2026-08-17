import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import UserRowActions from "./UserRowActions";
import styles from "./UserTable.module.css";

export default function UserTable({
  users,
  currentUid,
  currentRole,
  onView,
  onToggleStatus,
  onDelete,
}) {
  if (users.length === 0) {
    return (
      <div className={styles.empty}>No users match your search or filters.</div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.uid}>
              <td className={styles.name}>{u.displayName || "—"}</td>
              <td className={styles.cell}>{u.email}</td>
              <td>
                <UserRoleBadge role={u.role} />
              </td>
              <td>
                <UserStatusBadge active={u.active} />
              </td>
              <td>
                <UserRowActions
                  user={u}
                  isSelf={u.uid === currentUid}
                  canDelete={currentRole === "owner"}
                  onView={onView}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}