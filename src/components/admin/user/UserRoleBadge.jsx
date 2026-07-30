import styles from "./UserRoleBadge.module.css";

const ROLE_LABELS = {
  owner: "Owner",
  staff: "Staff",
  dispatcher: "Dispatcher",
  checklist_admin: "Checklist Admin",
};

const ROLE_CLASS = {
  owner: styles.owner,
  staff: styles.staff,
  dispatcher: styles.dispatcher,
  checklist_admin: styles.checklistAdmin,
};

export default function UserRoleBadge({ role }) {
  return (
    <span className={`${styles.badge} ${ROLE_CLASS[role] || styles.staff}`}>
      {role === "owner" && <span className={styles.dot} />}
      {ROLE_LABELS[role] || role}
    </span>
  );
}
