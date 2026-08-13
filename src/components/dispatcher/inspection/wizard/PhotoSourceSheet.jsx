import React from "react";
import styles from "./PhotoSourceSheet.module.css";

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8.5a2 2 0 0 1 2-2h1.2l1-1.5h7.6l1 1.5H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 16.5l4.5-4.5 3 3 3.5-3.5L20 16" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export default function PhotoSourceSheet({ isOpen, onClose, onTakePhoto, onChooseFile, label }) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={label ? `Add ${label} photo` : "Add photo"}
      >
        <div className={styles.handle} />
        <p className={styles.title}>{label ? `Add ${label} Photo` : "Add Photo"}</p>

        <button type="button" className={styles.option} onClick={onTakePhoto}>
          <CameraIcon />
          <span>Take Photo</span>
        </button>

        <button type="button" className={styles.option} onClick={onChooseFile}>
          <GalleryIcon />
          <span>Choose from Gallery</span>
        </button>

        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}