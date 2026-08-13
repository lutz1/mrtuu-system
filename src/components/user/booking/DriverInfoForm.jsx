import React from "react";
import styles from "./DriverInfoForm.module.css";

function UploadField({ id, label, file, onChange }) {
  return (
    <div className={styles.formField}>
      <label className={styles.formLabel} htmlFor={id}>
        {label} <span className={styles.required}>*</span>
      </label>
      <label htmlFor={id} className={styles.uploadBox}>
        <input
          id={id}
          type="file"
          accept=".jpg,.jpeg,.png"
          className={styles.uploadInput}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <span className={styles.uploadText}>
          {file ? file.name : (
            <>
              Click to upload <span className={styles.uploadTextMuted}>or drag and drop</span>
            </>
          )}
        </span>
        <span className={styles.uploadHint}>JPG and PNG (Max. 5MB)</span>
      </label>
    </div>
  );
}

export default function DriverInfoForm({
  driver = {},
  onChange = () => {},
  files = {}, // <-- Default fallback prevents crash if files is undefined
  onFileChange = () => {}
}) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <svg className={styles.headingIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
        <h2 className={styles.cardTitle}>Driver Information</h2>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            className={styles.formInput}
            placeholder="Selsite Tortskie"
            value={driver?.fullName ?? ""}
            onChange={(e) => onChange("fullName", e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className={styles.formInput}
            placeholder="tortskie@gmail.com"
            value={driver?.email ?? ""}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            className={styles.formInput}
            placeholder="09957463523"
            value={driver?.phone ?? ""}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="licenseNo">Driver's License No.</label>
          <input
            id="licenseNo"
            type="text"
            className={styles.formInput}
            placeholder="ABCD12344567"
            value={driver?.licenseNo ?? ""}
            onChange={(e) => onChange("licenseNo", e.target.value)}
          />
        </div>

        <UploadField
          id="driversLicenseFile"
          label="Upload Driver's License"
          file={files?.driversLicense ?? null}
          onChange={(file) => onFileChange("driversLicense", file)}
        />
        <UploadField
          id="validIdFile"
          label="Upload Valid ID"
          file={files?.validId ?? null}
          onChange={(file) => onFileChange("validId", file)}
        />
      </div>
    </section>
  );
}