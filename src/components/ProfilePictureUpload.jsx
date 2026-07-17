import React, { useRef, useState } from "react";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import NavIcon from "./icons/NavIcon";
import styles from "./ProfilePictureUpload.module.css";

const MAX_SIZE_MB = 5;

export default function ProfilePictureUpload({ photoURL, displayName }) {
  const { refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewURL, setPreviewURL] = useState(null);

  const initial = (displayName || "?").trim().charAt(0).toUpperCase();
  const displaySrc = previewURL || photoURL;

  const openFilePicker = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewURL(localPreview);
    setUploading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not signed in");

      const fileRef = ref(storage, `profile-pictures/${currentUser.uid}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      await updateProfile(currentUser, { photoURL: downloadURL });
      refreshUser(); // forces context + every consumer to re-render with the new photoURL
    } catch (err) {
      console.error("Profile picture upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
      setPreviewURL(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.avatarButton}
        onClick={openFilePicker}
        disabled={uploading}
        aria-label="Change profile picture"
      >
        {displaySrc ? (
          <img src={displaySrc} alt={displayName || "Profile"} className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarFallback}>{initial}</div>
        )}

        <span className={styles.hoverOverlay}>{uploading ? "Uploading…" : "Edit"}</span>

        <span className={styles.editBadge} aria-hidden="true">
          <NavIcon name="camera" />
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}