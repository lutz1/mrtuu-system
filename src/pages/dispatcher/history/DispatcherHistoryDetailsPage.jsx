import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import DispatcherLayout from "../DispatcherLayout";
import DocumentThumbnails from "../../../components/common/DocumentThumbnails";
import ImageLightbox from "../../../components/common/ImageLightbox";
import InspectionStatusBadge from "../../../components/dispatcher/history/InspectionStatusBadge";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import styles from "./DispatcherHistoryDetailsPage.module.css";

const PHOTO_LABELS = {
  front: "Front",
  back: "Back",
  left: "Left side",
  right: "Right side",
};
const CONDITION_LABELS = {
  exterior: "Exterior",
  interior: "Interior",
  tires: "Tires",
  lights: "Lights",
};
const DOCUMENT_LABELS = {
  orcr: "OR/CR",
  insurance: "Insurance",
  officialReceipt: "Official receipt",
  vehicleRegistration: "Vehicle registration",
};

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateTime(d) {
  if (!d) return "—";
  return d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function km(value) {
  if (value === null || value === undefined || value === "") return "—";
  return `${Number(value).toLocaleString()} km`;
}

function InfoItem({ label, children }) {
  return (
    <div className={styles.infoItem}>
      <p className={styles.factLabel}>{label}</p>
      <p className={styles.factValue}>{children || "—"}</p>
    </div>
  );
}

function FactRow({ label, value }) {
  return (
    <div className={styles.factRow}>
      <dt className={styles.factLabel}>{label}</dt>
      <dd className={styles.factValue}>{value || "—"}</dd>
    </div>
  );
}

function ChecklistCard({
  title,
  checklist,
  emptyText,
  showDocuments,
  onPhotoClick,
}) {
  if (!checklist) {
    return (
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.empty}>{emptyText}</p>
      </section>
    );
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <span className={styles.muted}>
          {formatDateTime(toDate(checklist.submittedAt))}
        </span>
      </div>

      <div className={styles.photoGrid}>
        {Object.entries(PHOTO_LABELS).map(([key, label]) => {
          const url = checklist.photos?.[key];
          return (
            <div key={key} className={styles.photoCell}>
              {url ? (
                <button
                  type="button"
                  className={styles.photoBtn}
                  onClick={() =>
                    onPhotoClick({ src: url, alt: `${title} - ${label}` })
                  }
                  aria-label={`View ${title} ${label} photo`}
                >
                  <img src={url} alt={label} className={styles.photoImg} />
                </button>
              ) : (
                <div className={styles.photoEmpty}>No photo</div>
              )}
              <span className={styles.photoLabel}>{label}</span>
            </div>
          );
        })}
      </div>

      <dl className={styles.facts}>
        <FactRow label="Odometer" value={km(checklist.odometerReading)} />
        <FactRow label="Fuel level" value={checklist.fuelLevel} />
        {Object.entries(CONDITION_LABELS).map(([key, label]) => (
          <FactRow key={key} label={label} value={checklist.condition?.[key]} />
        ))}
        {showDocuments &&
          Object.entries(DOCUMENT_LABELS).map(([key, label]) => (
            <FactRow
              key={key}
              label={label}
              value={checklist.documents?.[key]}
            />
          ))}
      </dl>

      {checklist.notes && (
        <div className={styles.remarks}>
          <p className={styles.factLabel}>Remarks</p>
          <p className={styles.remarksText}>{checklist.notes}</p>
        </div>
      )}
    </section>
  );
}

function ComparisonCard({ pre, post }) {
  const pickupOdo = Number(pre.odometerReading);
  const returnOdo = Number(post.odometerReading);
  const distance =
    Number.isFinite(pickupOdo) && Number.isFinite(returnOdo)
      ? returnOdo - pickupOdo
      : null;

  const rows = [
    { label: "Fuel level", pickup: pre.fuelLevel, ret: post.fuelLevel },
    ...Object.entries(CONDITION_LABELS).map(([key, label]) => ({
      label,
      pickup: pre.condition?.[key],
      ret: post.condition?.[key],
    })),
  ];

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Pickup vs Return</h2>
        {distance !== null && distance >= 0 && (
          <span className={styles.distance}>
            Distance driven: {distance.toLocaleString()} km
          </span>
        )}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Pickup</th>
              <th>Return</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Odometer</td>
              <td>{km(pre.odometerReading)}</td>
              <td>{km(post.odometerReading)}</td>
              <td>
                <span className={styles.same}>—</span>
              </td>
            </tr>
            {rows.map((row) => {
              const known = row.pickup && row.ret;
              const changed = known && row.pickup !== row.ret;
              return (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.pickup || "—"}</td>
                  <td>{row.ret || "—"}</td>
                  <td>
                    {!known ? (
                      <span className={styles.same}>—</span>
                    ) : changed ? (
                      <span className={styles.changed}>Changed</span>
                    ) : (
                      <span className={styles.same}>Same</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function DispatcherHistoryDetailsPage() {
  const { bookingId } = useParams();
  const { getBookingById, loading } = useAdminBookings();
  const [preview, setPreview] = useState(null);

  const booking = getBookingById(decodeURIComponent(bookingId));

  if (!booking) {
    return (
      <DispatcherLayout>
        <div className={styles.pageHeading}>
          <Link to="/dispatcher/history" className={styles.backLink}>
            Back to history
          </Link>
          <h1 className={styles.title}>
            {loading ? "Loading inspection…" : "Inspection not found"}
          </h1>
          {!loading && (
            <p className={styles.subtitle}>
              This booking may not exist or you may not have access to it.
            </p>
          )}
        </div>
      </DispatcherLayout>
    );
  }

  const pre = booking.dispatchChecklist?.preRent || null;
  const post = booking.dispatchChecklist?.postRent || null;

  return (
    <DispatcherLayout>
      <div className={styles.pageHeading}>
        <Link to="/dispatcher/history" className={styles.backLink}>
          Back to history
        </Link>
        <h1 className={styles.title}>Inspection Details</h1>
        <p className={styles.subtitle}>
          Booking {booking.id} · pickup and return inspection records.
        </p>
      </div>

      <div className={styles.stack}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Booking & Customer</h2>
            <InspectionStatusBadge status={post ? "Returned" : "Cleared"} />
          </div>
          <div className={styles.infoGrid}>
            <InfoItem label="Booking ID">{booking.id}</InfoItem>
            <InfoItem label="Customer">{booking.customer}</InfoItem>
            <InfoItem label="Phone">{booking.phone}</InfoItem>
            <InfoItem label="Email">{booking.driver?.email}</InfoItem>
            <InfoItem label="Driver's license no.">
              {booking.driver?.licenseNo}
            </InfoItem>
            <InfoItem label="Vehicle">
              {booking.vehicle}
              {booking.plate && booking.plate !== "—"
                ? ` (${booking.plate})`
                : ""}
            </InfoItem>
            <InfoItem label="Pickup">
              {`${booking.pickupDateDisplay} ${booking.pickupTime}`.trim()}
            </InfoItem>
            <InfoItem label="Return">
              {`${booking.returnDateDisplay} ${booking.returnTime}`.trim()}
            </InfoItem>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Customer Documents</h2>
          <DocumentThumbnails booking={booking} />
        </section>

        <div className={styles.columns}>
          <ChecklistCard
            title="Pickup Checklist"
            checklist={pre}
            emptyText="No pickup inspection has been submitted yet."
            showDocuments
            onPhotoClick={setPreview}
          />
          <ChecklistCard
            title="Return Checklist"
            checklist={post}
            emptyText="The vehicle hasn't been inspected on return yet."
            onPhotoClick={setPreview}
          />
        </div>

        {pre && post && <ComparisonCard pre={pre} post={post} />}
      </div>

      {preview && (
        <ImageLightbox
          src={preview.src}
          alt={preview.alt}
          onClose={() => setPreview(null)}
        />
      )}
    </DispatcherLayout>
  );
}
