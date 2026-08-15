import React from "react";
import styles from "./DraftVehiclesTable.module.css";

function VehiclePlaceholderThumb() {
  return (
    <svg viewBox="0 0 60 44" className={styles.placeholderSvg} xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="60" height="44" fill="var(--color-bg-muted)" />
      <path
        d="M10 30h40M13 30l3-8a2.5 2.5 0 0 1 2.2-1.5h23.6a2.5 2.5 0 0 1 2.2 1.5l3 8M17 27v-3h26v3"
        stroke="var(--color-border-medium)"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="31.5" r="2.6" fill="var(--color-border-medium)" />
      <circle cx="41" cy="31.5" r="2.6" fill="var(--color-border-medium)" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 4.5l4 4L8 20H4v-4l11.5-11.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function formatDate(value) {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function DraftVehiclesTable({ drafts, onEdit, onDelete }) {
  if (drafts.length === 0) {
    return <div className={styles.empty}>No drafts match your search or filter.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Draft ID</th>
            <th>Vehicle</th>
            <th>Plate Number</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drafts.map((draft, i) => (
            <tr key={draft.id}>
              <td className={styles.draftId}>DRAFT-{String(i + 1).padStart(3, "0")}</td>
              <td>
                <div className={styles.vehicleCell}>
                  <span className={styles.thumb}>
                    {draft.images?.[0] ? (
                      <img src={draft.images[0]} alt={draft.name || "Draft vehicle"} className={styles.thumbImage} />
                    ) : (
                      <VehiclePlaceholderThumb />
                    )}
                  </span>
                  <div>
                    <p className={styles.vehicleName}>{draft.name || "Untitled Draft"}</p>
                    <p className={styles.vehicleMeta}>
                      {draft.seats ? `${draft.seats} Seater` : "— Seater"} • {draft.type || "—"}
                    </p>
                  </div>
                </div>
              </td>
              <td className={styles.cell}>{draft.plate?.trim() ? draft.plate : "(No Plate)"}</td>
              <td className={styles.cell}>{formatDate(draft.updatedAt)}</td>
              <td>
                <div className={styles.actionsRow}>
                  <button type="button" className={styles.editBtn} onClick={() => onEdit(draft)}>
                    <EditIcon />
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => onDelete(draft)}
                    aria-label={`Delete ${draft.name || "draft"}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}