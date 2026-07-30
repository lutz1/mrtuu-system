import React, { useRef } from "react";
import { VEHICLE_BRANDS, VEHICLE_TYPES } from "../../../../data/admin/mockVehicles";
import fields from "./FormFields.module.css";
import styles from "./BasicInfoStep.module.css";

function PhotoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 16.5l4.5-4.5 3 3 3.5-3.5L20 16" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function PhotoSlot({ photo, onSelect, onRemove, isMain }) {
  const inputRef = useRef(null);

  if (photo) {
    return (
      <div className={`${styles.photoSlot} ${isMain ? styles.photoSlotMain : ""}`}>
        <img src={photo.previewUrl} alt="Vehicle" className={styles.photoImage} />
        <button type="button" className={styles.removePhotoBtn} onClick={onRemove} aria-label="Remove photo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <label className={`${styles.photoSlot} ${styles.photoSlotEmpty} ${isMain ? styles.photoSlotMain : ""}`}>
      <PhotoIcon />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}

export default function BasicInfoStep({ form, updateField, photos, onPhotoSelect, onPhotoRemove }) {
  return (
    <div className={fields.stepGrid}>
      <div className={fields.column}>
        <h2 className={fields.stepTitle}>Basic Info</h2>

        <div className={fields.field}>
          <label className={fields.label} htmlFor="carName">
            Car Name <span className={fields.required}>*</span>
          </label>
          <input
            id="carName"
            type="text"
            className={fields.input}
            placeholder="e.g. Toyota Vios 2024"
            value={form.carName}
            onChange={(e) => updateField("carName", e.target.value)}
          />
        </div>

        <div className={fields.row}>
          <div className={fields.field}>
            <label className={fields.label} htmlFor="brand">
              Brand <span className={fields.required}>*</span>
            </label>
            <select id="brand" className={fields.select} value={form.brand} onChange={(e) => updateField("brand", e.target.value)}>
              <option value="">Select Brand</option>
              {VEHICLE_BRANDS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className={fields.field}>
            <label className={fields.label} htmlFor="model">
              Model <span className={fields.required}>*</span>
            </label>
            <input
              id="model"
              type="text"
              className={fields.input}
              placeholder="e.g. Vios"
              value={form.model}
              onChange={(e) => updateField("model", e.target.value)}
            />
          </div>
        </div>

        <div className={fields.field}>
          <label className={fields.label} htmlFor="type">
            Type <span className={fields.required}>*</span>
          </label>
          <select id="type" className={fields.select} value={form.type} onChange={(e) => updateField("type", e.target.value)}>
            <option value="">Select Type</option>
            {VEHICLE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <p className={fields.hint}>Tip: You can update all information later. Fields marked with * are required.</p>
      </div>

      <div className={fields.column}>
        <h2 className={fields.stepTitle}>Photos</h2>

        <PhotoSlot
          photo={photos[0]}
          onSelect={(file) => onPhotoSelect(0, file)}
          onRemove={() => onPhotoRemove(0)}
          isMain
        />

        <div className={styles.thumbRow}>
          {[1, 2, 3, 4].map((i) => (
            <PhotoSlot key={i} photo={photos[i]} onSelect={(file) => onPhotoSelect(i, file)} onRemove={() => onPhotoRemove(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}