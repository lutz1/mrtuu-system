import { useEffect, useState } from "react";
import { useAdminVehicles } from "../../../context/AdminVehiclesContext";
import { useToast } from "../../../context/ToastContext";
import styles from "./VehicleViewOverlay.module.css";

function VehiclePlaceholderImage() {
  return (
    <svg
      viewBox="0 0 200 110"
      className={styles.placeholderSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="200" height="110" fill="#f0f1f3" />
      <path
        d="M30 75h140M40 75l8-22a8 8 0 0 1 7-5h30a8 8 0 0 1 7 5l8 22M55 75v-8h90v8"
        stroke="#c7cad0"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="78" r="8" fill="#c7cad0" />
      <circle cx="140" cy="78" r="8" fill="#c7cad0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#4b5563" />
      <path
        d="M6 10l3 3 5-5"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(date) {
  if (!date) return "—";

  let d;

  // 1. Handle Firebase / Firestore Timestamp objects (with toDate method)
  if (typeof date?.toDate === "function") {
    d = date.toDate();
  }
  // 2. Handle Firestore Timestamp objects represented as plain JS objects ({ seconds, nanoseconds })
  else if (typeof date === "object" && typeof date?.seconds === "number") {
    d = new Date(date.seconds * 1000);
  }
  // 3. Handle standard Date instances directly
  else if (date instanceof Date) {
    d = date;
  }
  // 4. Handle Strings or numeric Epoch Timestamps
  else {
    d = new Date(date);
  }

  // Fallback if Date parsing results in an Invalid Date
  if (Number.isNaN(d.getTime())) return String(date);

  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function VehicleViewOverlay({ vehicle, onClose, onEdit }) {
  const { archiveVehicle } = useAdminVehicles();
  const [activeIndex, setActiveIndex] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!vehicle) return null;

  const images = vehicle.images?.length
    ? vehicle.images
    : vehicle.imageUrl
    ? [vehicle.imageUrl]
    : [];
  const hasImages = images.length > 0;
  const currentImage = images[activeIndex];

  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);

  const handleArchive = () => {
      // eslint-disable-next-line no-alert
      const confirmed = window.confirm(
        `Archive ${vehicle.name}? It will be removed from the active showroom. This can't be undone from here yet.`
      );
      if (!confirmed) return;
      archiveVehicle(vehicle.id);
      showToast(`${vehicle.name} archived.`, { type: "info" });
      onClose();
    };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>View Vehicle</h1>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            X
          </button>
        </div>

        {/* Scrollable Body */}
        <div className={styles.body}>
          {/* Top Row: Main Specs Card + Status Card */}
          <div className={styles.topGrid}>
            {/* Identity & Gallery Card */}
            <section className={styles.identityCard}>
              <div className={styles.galleryContainer}>
                <div className={styles.galleryMain}>
                  {hasImages ? (
                    <img
                      src={currentImage}
                      alt={vehicle.name}
                      className={styles.galleryImage}
                    />
                  ) : (
                    <VehiclePlaceholderImage />
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className={`${styles.galleryNav} ${styles.galleryNavPrev}`}
                        onClick={goPrev}
                        aria-label="Previous photo"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className={`${styles.galleryNav} ${styles.galleryNavNext}`}
                        onClick={goNext}
                        aria-label="Next photo"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className={styles.thumbRow}>
                    {images.map((img, i) => (
                      <button
                        key={img + i}
                        type="button"
                        className={`${styles.thumb} ${
                          i === activeIndex ? styles.thumbActive : ""
                        }`}
                        onClick={() => setActiveIndex(i)}
                      >
                        <img src={img} alt="" className={styles.thumbImage} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Side Details inside Identity Card */}
              <div className={styles.identityInfo}>
                <h2 className={styles.vehicleName}>
                  {vehicle.name} {vehicle.variant ? vehicle.variant : ""}
                </h2>
                <span className={styles.statusBadge}>{vehicle.status}</span>

                <dl className={styles.infoList}>
                  <div className={styles.infoRow}>
                    <dt>Plate Number</dt>
                    <dd>{vehicle.plate}</dd>
                  </div>
                  <div className={styles.infoRow}>
                    <dt>Vehicle Type</dt>
                    <dd>{vehicle.type}</dd>
                  </div>
                  <div className={styles.infoRow}>
                    <dt>Transmission</dt>
                    <dd>{vehicle.transmission}</dd>
                  </div>
                  <div className={styles.infoRow}>
                    <dt>Fuel Type</dt>
                    <dd>{vehicle.fuelType || "—"}</dd>
                  </div>
                  <div className={styles.infoRow}>
                    <dt>Year Model</dt>
                    <dd>{vehicle.yearModel || "—"}</dd>
                  </div>
                  <div className={styles.infoRow}>
                    <dt>Color</dt>
                    <dd>{vehicle.color || "—"}</dd>
                  </div>
                  <div className={styles.infoRow}>
                    <dt>Daily Rate</dt>
                    <dd>₱ {Number(vehicle.price || 0).toLocaleString()}</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Status Information Card */}
            <section className={styles.statusCard}>
              <h2 className={styles.cardTitle}>Status Information</h2>

              <div className={styles.statusList}>
                <div className={styles.statusRow}>
                  <span className={styles.statusLabel}>Status</span>
                  <span className={styles.statusValueBadge}>
                    {vehicle.status}
                  </span>
                </div>
                <div className={styles.statusRow}>
                  <span className={styles.statusLabel}>Availability</span>
                  <span className={styles.statusValueBold}>
                    {vehicle.status}
                  </span>
                </div>
                <div className={styles.statusRow}>
                  <span className={styles.statusLabel}>Added On</span>
                  <span className={styles.statusValueBold}>
                    {formatDate(vehicle.addedOn)}
                  </span>
                </div>
                <div className={styles.statusRow}>
                  <span className={styles.statusLabel}>Last Updated</span>
                  <span className={styles.statusValueBold}>
                    {formatDate(vehicle.updatedAt) ?? "—"}
                  </span>
                </div>
              </div>

              <div className={styles.statusActions}>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => onEdit(vehicle)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Vehicle
                </button>
                <button
                  type="button"
                  className={styles.archiveBtn}
                  onClick={handleArchive}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="4" rx="1" />
                    <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
                    <path d="M10 12h4" />
                  </svg>
                  Archive Vehicle
                </button>
              </div>
            </section>
          </div>

          {/* Middle Row: Specifications & Features */}
          <div className={styles.bottomGrid}>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Vehicle Specifications</h2>
              <div className={styles.specsGrid}>
                <div className={styles.specsColumn}>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Brand</span>
                    <span className={styles.specValue}>
                      {vehicle.brand || "—"}
                    </span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Model</span>
                    <span className={styles.specValue}>
                      {vehicle.model || "—"}
                    </span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Variant</span>
                    <span className={styles.specValue}>
                      {vehicle.variant || "—"}
                    </span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Seating Capacity</span>
                    <span className={styles.specValue}>
                      {vehicle.seats} Seats
                    </span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Doors</span>
                    <span className={styles.specValue}>
                      {vehicle.doors ? `${vehicle.doors} Doors` : "—"}
                    </span>
                  </div>
                </div>
                <div className={styles.specsColumn}>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Transmission</span>
                    <span className={styles.specValue}>
                      {vehicle.transmission}
                    </span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Engine</span>
                    <span className={styles.specValue}>
                      {vehicle.engine || "—"}
                    </span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Fuel Capacity</span>
                    <span className={styles.specValue}>
                      {vehicle.fuelCapacity
                        ? `${vehicle.fuelCapacity} Liters`
                        : "—"}
                    </span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Mileage</span>
                    <span className={styles.specValue}>
                      {vehicle.mileage ? `${vehicle.mileage} km/l` : "—"}
                    </span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Drivetrain</span>
                    <span className={styles.specValue}>
                      {vehicle.drivetrain || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Features &amp; Equipment</h2>
              {vehicle.features?.length ? (
                <div className={styles.featuresGrid}>
                  {vehicle.features.map((feature) => (
                    <div key={feature} className={styles.featureItem}>
                      <span className={styles.featureIcon}>
                        <CheckIcon />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyText}>
                  No features listed for this vehicle.
                </p>
              )}
            </section>
          </div>

          {/* Bottom Row: Description */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Description</h2>
            <p className={styles.descriptionText}>
              {vehicle.description || "No description added yet."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
