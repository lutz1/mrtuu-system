import React, { useRef, useState } from "react";
import {
  VEHICLE_BRANDS,
  VEHICLE_TYPES,
  VEHICLE_COLORS,
} from "../../../../data/admin/mockVehicles";
import fields from "./FormFields.module.css";
import styles from "./BasicInfoStep.module.css";

function PhotoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="8.5"
        cy="9.5"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5 16.5l4.5-4.5 3 3 3.5-3.5L20 16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Pulls image files out of a drop event, ignoring non-images
function extractImageFiles(dataTransfer) {
  const files = Array.from(dataTransfer?.files || []);
  return files.filter((f) => f.type.startsWith("image/"));
}

/**
 * Single-photo slot (used for the main/thumbnail photo).
 * Supports click-to-select (one file) and drag-and-drop (one file — if
 * multiple are dropped here, only the first is used).
 */
function PhotoSlot({ photo, onSelect, onRemove, isMain }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const imageFiles = extractImageFiles(e.dataTransfer);
    if (imageFiles.length > 0) onSelect(imageFiles[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  if (photo) {
    return (
      <div
        className={`${styles.photoSlot} ${isMain ? styles.photoSlotMain : ""}`}
      >
        <img
          src={photo.previewUrl}
          alt="Vehicle"
          className={styles.photoImage}
        />
        <button
          type="button"
          className={styles.removePhotoBtn}
          onClick={onRemove}
          aria-label="Remove photo"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <label
      className={`${styles.photoSlot} ${styles.photoSlotEmpty} ${
        isMain ? styles.photoSlotMain : ""
      } ${isDragOver ? styles.photoSlotDragOver : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
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

/**
 * Group of up to 4 thumbnail slots (indices 1-4). Clicking any empty slot
 * opens a multi-select file dialog; dropping multiple files anywhere in the
 * group fills the empty slots in order. Selecting/dropping more files than
 * there are empty slots just fills what's available and ignores the rest.
 */
function ThumbPhotoGroup({ photos, onPhotoSelect, onPhotoRemove }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const indices = [1, 2, 3, 4];
  const emptyIndices = indices.filter((i) => !photos[i]);

  const distributeFiles = (fileList) => {
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );
    const targets = emptyIndices.slice(0, files.length);
    targets.forEach((slotIndex, i) => {
      onPhotoSelect(slotIndex, files[i]);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const imageFiles = extractImageFiles(e.dataTransfer);
    if (imageFiles.length > 0) distributeFiles(imageFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (emptyIndices.length > 0) setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleInputChange = (e) => {
    if (e.target.files?.length) distributeFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div
      className={`${styles.thumbRow} ${
        isDragOver ? styles.thumbRowDragOver : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Shared hidden input, opened by any empty slot, allows picking up to 4 at once */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={handleInputChange}
      />

      {indices.map((i) =>
        photos[i] ? (
          <div key={i} className={styles.photoSlot}>
            <img
              src={photos[i].previewUrl}
              alt="Vehicle"
              className={styles.photoImage}
            />
            <button
              type="button"
              className={styles.removePhotoBtn}
              onClick={() => onPhotoRemove(i)}
              aria-label="Remove photo"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <button
            key={i}
            type="button"
            className={`${styles.photoSlot} ${styles.photoSlotEmpty}`}
            onClick={() => inputRef.current?.click()}
          >
            <PhotoIcon />
          </button>
        )
      )}
    </div>
  );
}

export default function BasicInfoStep({
  form,
  updateField,
  photos,
  onPhotoSelect,
  onPhotoRemove,
}) {
  return (
    <div className={fields.stepGrid}>
      {/* 1. Left Column: Basic Info Fields */}
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

        <div className={fields.field}>
          <label className={fields.label} htmlFor="plate">
            License Plate <span className={fields.required}>*</span>
          </label>
          <input
            id="plate"
            type="text"
            className={fields.input}
            placeholder="e.g. ABC 1234"
            value={form.plate}
            onChange={(e) => updateField("plate", e.target.value.toUpperCase())}
          />
        </div>

        <div className={fields.row}>
          <div className={fields.field}>
            <label className={fields.label} htmlFor="brand">
              Brand <span className={fields.required}>*</span>
            </label>
            <select
              id="brand"
              className={fields.select}
              value={form.brand}
              onChange={(e) => updateField("brand", e.target.value)}
            >
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
          <select
            id="type"
            className={fields.select}
            value={form.type}
            onChange={(e) => updateField("type", e.target.value)}
          >
            <option value="">Select Type</option>
            {VEHICLE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className={fields.row}>
          <div className={fields.field}>
            <label className={fields.label} htmlFor="yearModel">
              Year Model
            </label>
            <input
              id="yearModel"
              type="number"
              min="1990"
              max="2100"
              className={fields.input}
              placeholder="e.g. 2024"
              value={form.yearModel}
              onChange={(e) => updateField("yearModel", e.target.value)}
            />
          </div>

          <div className={fields.field}>
            <label className={fields.label} htmlFor="color">
              Color
            </label>
            <select
              id="color"
              className={fields.select}
              value={form.color}
              onChange={(e) => updateField("color", e.target.value)}
            >
              <option value="">Select color</option>
              {VEHICLE_COLORS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={fields.field}>
          <label className={fields.label} htmlFor="mileage">
            Mileage
          </label>
          <input
            id="mileage"
            type="text"
            className={fields.input}
            placeholder="e.g. Unlimited or 50,000 km"
            value={form.mileage}
            onChange={(e) => updateField("mileage", e.target.value)}
          />
        </div>
      </div>

      {/* 2. Right Column: Photos Column */}
      <div className={fields.column}>
        <p className={fields.hint} style={{ marginBottom: "16px" }}>
          Tip: You can update all information later. Fields marked with * are
          required. All 5 photos are required to save. Drag and drop images,
          or select up to 4 at once for the thumbnails below.
        </p>

        <h2 className={fields.stepTitle}>Photos</h2>

        <PhotoSlot
          photo={photos[0]}
          onSelect={(file) => onPhotoSelect(0, file)}
          onRemove={() => onPhotoRemove(0)}
          isMain
        />

        <ThumbPhotoGroup
          photos={photos}
          onPhotoSelect={onPhotoSelect}
          onPhotoRemove={onPhotoRemove}
        />
      </div>
    </div>
  );
}