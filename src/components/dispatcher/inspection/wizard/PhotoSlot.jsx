import React, { useRef, useState } from "react";
import PhotoSourceSheet from "./PhotoSourceSheet";
import styles from "./PhotoSlot.module.css";

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8.5a2 2 0 0 1 2-2h1.2l1-1.5h7.6l1 1.5H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function PhotoSlot({ label, photo, onSelect, onRemove }) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleFileChosen = (e) => {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
    e.target.value = "";
  };

  const openSheet = () => setIsSheetOpen(true);
  const closeSheet = () => setIsSheetOpen(false);

  const handleTakePhoto = () => {
    closeSheet();
    cameraInputRef.current?.click();
  };

  const handleChooseFile = () => {
    closeSheet();
    galleryInputRef.current?.click();
  };

  // These two hidden inputs live outside the `if (photo)` branch so they
  // persist regardless of filled/empty state, and their refs stay stable.
  const hiddenInputs = (
    <>
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className={styles.hiddenInput}
        onChange={handleFileChosen}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChosen}
      />
    </>
  );

  if (photo) {
    return (
      <div className={styles.slotFilled}>
        <img src={photo.previewUrl} alt={label} className={styles.image} />
        <span className={styles.filledLabel}>{label}</span>
        <button type="button" className={styles.removeBtn} onClick={onRemove} aria-label={`Remove ${label} photo`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        {hiddenInputs}
      </div>
    );
  }

  return (
    <>
      <button type="button" className={styles.slotEmpty} onClick={openSheet}>
        <CameraIcon />
        <span className={styles.slotTitle}>{label}</span>
        <span className={styles.slotHint}>Click to take photo</span>
        {hiddenInputs}
      </button>

      <PhotoSourceSheet
        isOpen={isSheetOpen}
        onClose={closeSheet}
        onTakePhoto={handleTakePhoto}
        onChooseFile={handleChooseFile}
        label={label}
      />
    </>
  );
}