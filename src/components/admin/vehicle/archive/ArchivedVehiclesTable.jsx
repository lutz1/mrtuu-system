import styles from "./ArchivedVehiclesTable.module.css";

function VehiclePlaceholderThumb() {
  return (
    <svg viewBox="0 0 60 44" className={styles.placeholderSvg} xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="60" height="44" fill="#f0f1f3" />
      <path
        d="M10 30h40M13 30l3-8a2.5 2.5 0 0 1 2.2-1.5h23.6a2.5 2.5 0 0 1 2.2 1.5l3 8M17 27v-3h26v3"
        stroke="#c7cad0"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="31.5" r="2.6" fill="#c7cad0" />
      <circle cx="41" cy="31.5" r="2.6" fill="#c7cad0" />
    </svg>
  );
}

function formatDate(date) {
  if (!date) return "—";

  let d;
  if (typeof date?.toDate === "function") {
    d = date.toDate();
  } else if (date instanceof Date) {
    d = date;
  } else if (typeof date === "number" || typeof date === "string") {
    d = new Date(date);
  } else if (typeof date === "object" && "seconds" in date) {
    d = new Date(date.seconds * 1000);
  } else {
    return "—";
  }

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArchivedVehiclesTable({ vehicles, onRestore }) {
  if (!vehicles || vehicles.length === 0) {
    return <div className={styles.empty}>No archived vehicles match your search or filters.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Plate Number</th>
            <th>Type</th>
            <th>Transmission</th>
            <th>Daily Rate</th>
            <th>Archived Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => {
            const vType = v.carType || v.type;
            const thumbUrl = v.imageUrl || v.images?.[0];

            return (
              <tr key={v.id}>
                <td>
                  <div className={styles.vehicleCell}>
                    <span className={styles.thumb}>
                      {thumbUrl ? (
                        <img src={thumbUrl} alt={v.name} className={styles.thumbImage} />
                      ) : (
                        <VehiclePlaceholderThumb />
                      )}
                    </span>
                    <div>
                      <p className={styles.vehicleName}>{v.name}</p>
                      <p className={styles.vehicleMeta}>
                        {v.seats} Seater • {vType}
                      </p>
                    </div>
                  </div>
                </td>
                <td className={styles.cell}>{v.plate}</td>
                <td className={styles.cell}>{vType}</td>
                <td className={styles.cell}>{v.transmission}</td>
                <td className={styles.cell}>₱ {(v.price || 0).toLocaleString()} / day</td>
                <td className={styles.cell}>{formatDate(v.archivedAt)}</td>
                <td>
                  <button type="button" className={styles.restoreBtn} onClick={() => onRestore(v)}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12a8 8 0 1 1 2.3 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 17v-5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Restore
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}