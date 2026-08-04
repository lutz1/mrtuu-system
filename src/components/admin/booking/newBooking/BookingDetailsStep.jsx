import React from "react";
import UploadDropzone from "./UploadDropzone";
import { ID_TYPES, PAYMENT_METHODS, PAYMENT_STATUSES } from "../../../../data/admin/newBookingOptions";
import fields from "./FormFields.module.css";
import summaryStyles from "./SelectedVehicleSummary.module.css";

function VehiclePlaceholderImage() {
  return (
    <svg viewBox="0 0 200 110" style={{ width: "100%", height: "100%", display: "block" }} xmlns="http://www.w3.org/2000/svg">
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

export default function BookingDetailsStep({
  vehicle,
  form,
  updateField,
  files,
  onFileSelect,
  onFileRemove,
  numDays,
  totalAmount,
  onChangeVehicle,
}) {
  return (
    <div>
      <div className={summaryStyles.card}>
        <div className={summaryStyles.thumb}>
          {vehicle.imageUrl ? (
            <img src={vehicle.imageUrl} alt={vehicle.name} className={summaryStyles.thumbImage} />
          ) : (
            <VehiclePlaceholderImage />
          )}
        </div>
        <div className={summaryStyles.info}>
          <p className={summaryStyles.label}>Selected Vehicle</p>
          <h3 className={summaryStyles.name}>{vehicle.name}</h3>
          <div className={summaryStyles.pillRow}>
            <span className={summaryStyles.pill}>{vehicle.type}</span>
            <span className={summaryStyles.pill}>{vehicle.transmission}</span>
            <span className={summaryStyles.pill}>{vehicle.seats} Seats</span>
            <span className={summaryStyles.pill}>{vehicle.fuelType || "Gasoline"}</span>
          </div>
          <p className={summaryStyles.price}>₱{vehicle.price.toLocaleString()} / day</p>
        </div>
        <button type="button" className={summaryStyles.changeBtn} onClick={onChangeVehicle}>
          Change Vehicle
        </button>
      </div>

      <section className={fields.section}>
        <h2 className={fields.sectionTitle}>Customer Information</h2>
        <div className={fields.row}>
          <div className={fields.field}>
            <label className={fields.label}>
              Full Name <span className={fields.required}>*</span>
            </label>
            <input
              type="text"
              className={fields.input}
              placeholder="Enter full name"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
            />
          </div>
          <div className={fields.field}>
            <label className={fields.label}>
              Contact Number <span className={fields.required}>*</span>
            </label>
            <input
              type="text"
              className={fields.input}
              placeholder="Enter contact number"
              value={form.contactNumber}
              onChange={(e) => updateField("contactNumber", e.target.value)}
            />
          </div>
        </div>
        <div className={fields.row}>
          <div className={fields.field}>
            <label className={fields.label}>Email (Optional)</label>
            <input
              type="email"
              className={fields.input}
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
          <div className={fields.field}>
            <label className={fields.label}>
              Address <span className={fields.required}>*</span>
            </label>
            <textarea
              className={fields.textarea}
              placeholder="Enter complete address"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={fields.section}>
        <h2 className={fields.sectionTitle}>Driver Information</h2>
        <div className={fields.row}>
          <div className={fields.fieldStack}>
            <div className={fields.field}>
              <label className={fields.label}>
                Driver's License Number <span className={fields.required}>*</span>
              </label>
              <input
                type="text"
                className={fields.input}
                placeholder="Enter License Number"
                value={form.licenseNumber}
                onChange={(e) => updateField("licenseNumber", e.target.value)}
              />
            </div>
            <div className={fields.field}>
              <label className={fields.label}>
                License Expiry Date <span className={fields.required}>*</span>
              </label>
              <input
                type="date"
                className={fields.input}
                value={form.licenseExpiry}
                onChange={(e) => updateField("licenseExpiry", e.target.value)}
              />
            </div>
          </div>
          <div className={fields.field}>
            <label className={fields.label}>
              Upload Driver's License <span className={fields.required}>*</span>
            </label>
            <UploadDropzone
              file={files.license}
              onSelect={(f) => onFileSelect("license", f)}
              onRemove={() => onFileRemove("license")}
            />
          </div>
        </div>
      </section>

      <section className={fields.section}>
        <h2 className={fields.sectionTitle}>Upload Valid ID</h2>
        <div className={fields.row}>
          <div className={fields.field}>
            <label className={fields.label}>
              Valid ID Type <span className={fields.required}>*</span>
            </label>
            <select className={fields.select} value={form.idType} onChange={(e) => updateField("idType", e.target.value)}>
              <option value="">Select ID Type</option>
              {ID_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className={fields.field}>
            <label className={fields.label}>
              Upload Valid ID <span className={fields.required}>*</span>
            </label>
            <UploadDropzone
              file={files.validId}
              onSelect={(f) => onFileSelect("validId", f)}
              onRemove={() => onFileRemove("validId")}
            />
          </div>
        </div>
      </section>

      <section className={fields.section}>
        <h2 className={fields.sectionTitle}>Rental Details</h2>
        <div className={fields.row}>
          <div className={fields.field}>
            <label className={fields.label}>
              Pickup Date <span className={fields.required}>*</span>
            </label>
            <input
              type="date"
              className={fields.input}
              value={form.pickupDate}
              onChange={(e) => updateField("pickupDate", e.target.value)}
            />
          </div>
          <div className={fields.field}>
            <label className={fields.label}>
              Return Date <span className={fields.required}>*</span>
            </label>
            <input
              type="date"
              className={fields.input}
              min={form.pickupDate || undefined}
              value={form.returnDate}
              onChange={(e) => updateField("returnDate", e.target.value)}
            />
          </div>
        </div>
        <div className={fields.row}>
          <div className={fields.field}>
            <label className={fields.label}>
              Pickup Time <span className={fields.required}>*</span>
            </label>
            <input
              type="time"
              className={fields.input}
              value={form.pickupTime}
              onChange={(e) => updateField("pickupTime", e.target.value)}
            />
          </div>
          <div className={fields.field}>
            <label className={fields.label}>
              Return Time <span className={fields.required}>*</span>
            </label>
            <input
              type="time"
              className={fields.input}
              value={form.returnTime}
              onChange={(e) => updateField("returnTime", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={fields.section}>
        <h2 className={fields.sectionTitle}>Payment Details</h2>
        <div className={fields.row}>
          <div className={fields.field}>
            <label className={fields.label}>Rental Price (per day)</label>
            <div className={fields.readOnlyInput}>₱{vehicle.price.toLocaleString()}</div>
          </div>
          <div className={fields.field}>
            <label className={fields.label}>Security Deposit</label>
            <input
              type="number"
              min="0"
              className={fields.input}
              value={form.securityDeposit}
              onChange={(e) => updateField("securityDeposit", e.target.value)}
            />
          </div>
        </div>
        <div className={fields.row}>
          <div className={fields.field}>
            <label className={fields.label}>
              No. of Days <span className={fields.required}>*</span>
            </label>
            <div className={fields.readOnlyInput}>{numDays}</div>
          </div>
          <div className={fields.field}>
            <label className={fields.label}>
              Payment Method <span className={fields.required}>*</span>
            </label>
            <select
              className={fields.select}
              value={form.paymentMethod}
              onChange={(e) => updateField("paymentMethod", e.target.value)}
            >
              <option value="">Select payment method</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={fields.row}>
          <div className={fields.field}>
            <label className={fields.label}>Total Amount</label>
            <div className={fields.readOnlyInput}>₱{totalAmount.toLocaleString()}</div>
          </div>
          <div className={fields.field}>
            <label className={fields.label}>
              Payment Status <span className={fields.required}>*</span>
            </label>
            <select
              className={fields.select}
              value={form.paymentStatus}
              onChange={(e) => updateField("paymentStatus", e.target.value)}
            >
              <option value="">Select status</option>
              {PAYMENT_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className={fields.section}>
        <h2 className={fields.sectionTitle}>Additional Information</h2>
        <div className={fields.field}>
          <label className={fields.label}>Remarks / Special Request (optional)</label>
          <textarea
            className={fields.textarea}
            placeholder="Enter remarks or special requests"
            value={form.remarks}
            onChange={(e) => updateField("remarks", e.target.value)}
          />
        </div>
      </section>
    </div>
  );
}