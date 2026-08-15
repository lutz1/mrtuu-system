import React, { useRef, useState, useEffect } from "react";
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

function extractImageFiles(dataTransfer) {
  const files = Array.from(dataTransfer?.files || []);
  return files.filter((f) => f.type.startsWith("image/"));
}

/**
 * Custom Searchable Select / Combobox with a fully styleable dropdown container
 */
function Combobox({ id, value, onChange, options, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes((value || "").toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.comboboxWrapper} ref={containerRef}>
      <div className={styles.inputWithArrow}>
        <input
          id={id}
          type="text"
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
        <span
          className={`${styles.dropdownArrow} ${isOpen ? styles.arrowOpen : ""}`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          ▼
        </span>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <ul className={styles.dropdownContainer}>
          {filteredOptions.map((option) => (
            <li
              key={option}
              className={`${styles.dropdownItem} ${
                option.toLowerCase() === (value || "").toLowerCase()
                  ? styles.dropdownItemSelected
                  : ""
              }`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
            <Combobox
              id="brand"
              className={fields.input}
              placeholder="Type or select Brand"
              value={form.brand}
              onChange={(val) => updateField("brand", val)}
              options={VEHICLE_BRANDS}
            />
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
            <Combobox
              id="color"
              className={fields.input}
              placeholder="Type or select Color"
              value={form.color}
              onChange={(val) => updateField("color", val)}
              options={VEHICLE_COLORS}
            />
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