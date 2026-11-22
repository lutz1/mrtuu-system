import { useState } from "react";
import { useBookingDocuments } from "../../context/useBookingDocuments";
import ImageLightbox from "./ImageLightbox";
import styles from "./DocumentThumbnails.module.css";

const SLOTS = [
  { key: "driversLicenseUrl", label: "Driver's License" },
  { key: "validIdUrl", label: "Valid ID" },
];

// Usage: <DocumentThumbnails booking={booking} />
// Works with any booking from useAdminBookings() (needs booking.uid / documents / driver).
export default function DocumentThumbnails({ booking }) {
  const { documents, loading } = useBookingDocuments(booking);
  const [preview, setPreview] = useState(null);

  return (
    <div className={styles.grid}>
      {SLOTS.map(({ key, label }) => {
        const url = documents[key];
        return (
          <div key={key} className={styles.slot}>
            <p className={styles.label}>{label}</p>
            {loading ? (
              <div className={styles.placeholder}>Loading…</div>
            ) : url ? (
              <button
                type="button"
                className={styles.thumbBtn}
                onClick={() => setPreview({ src: url, alt: label })}
                aria-label={`View ${label}`}
              >
                <img src={url} alt={label} className={styles.thumb} />
              </button>
            ) : (
              <div className={styles.placeholder}>Not uploaded</div>
            )}
          </div>
        );
      })}

      {preview && (
        <ImageLightbox
          src={preview.src}
          alt={preview.alt}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
