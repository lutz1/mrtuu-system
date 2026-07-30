import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminLayout from "../dashboard/AdminLayout";
import { useAdminVehicles } from "../../../context/AdminVehiclesContext";
import { VEHICLE_STATUSES, VEHICLE_TYPES } from "../../../data/admin/mockVehicles";
import styles from "./AdminAddVehiclePage.module.css";

const EMPTY_FORM = {
  name: "",
  plate: "",
  transmission: "Automatic",
  seats: 5,
  type: VEHICLE_TYPES[0],
  price: "",
  status: "Available",
};

const MAX_IMAGE_SIZE_MB = 5;

export default function AdminAddVehiclePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addVehicle, updateVehicle, getVehicleById } = useAdminVehicles();

  const isEditMode = Boolean(id);
  const existingVehicle = isEditMode ? getVehicleById(id) : null;

  const [form, setForm] = useState(() =>
    existingVehicle
      ? {
          name: existingVehicle.name,
          plate: existingVehicle.plate,
          transmission: existingVehicle.transmission,
          seats: existingVehicle.seats,
          type: existingVehicle.type,
          price: existingVehicle.price,
          status: existingVehicle.status,
        }
      : EMPTY_FORM
  );

  // The vehicle's existing photo (a URL that may already be shown on its
  // card elsewhere in the app) is tracked separately from any brand-new
  // photo picked in this session. We only ever revoke the new one — the
  // existing URL isn't ours to release, since other views may still be
  // using it right now.
  const [existingImageUrl, setExistingImageUrl] = useState(existingVehicle?.imageUrl ?? null);
  const [newImagePreviewUrl, setNewImagePreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (newImagePreviewUrl) URL.revokeObjectURL(newImagePreviewUrl);
    };
  }, [newImagePreviewUrl]);

  if (isEditMode && !existingVehicle) {
    return (
      <AdminLayout>
        <div className={styles.pageHeading}>
          <Link to="/admin/vehicles" className={styles.backLink}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Vehicles
          </Link>
          <h1 className={styles.title}>Vehicle not found</h1>
          <p className={styles.subtitle}>This vehicle may have been removed. Refreshing also resets mock data.</p>
        </div>
      </AdminLayout>
    );
  }

  const displayImageUrl = newImagePreviewUrl ?? existingImageUrl;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setError("");
    if (newImagePreviewUrl) URL.revokeObjectURL(newImagePreviewUrl);
    setNewImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (newImagePreviewUrl) {
      URL.revokeObjectURL(newImagePreviewUrl);
      setNewImagePreviewUrl(null);
    }
    setExistingImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.plate.trim() || !form.price) {
      setError("Vehicle name, plate number, and price are required.");
      return;
    }

    const vehicleData = {
      name: form.name.trim(),
      plate: form.plate.trim().toUpperCase(),
      transmission: form.transmission,
      seats: Number(form.seats),
      type: form.type,
      price: Number(form.price),
      status: form.status,
      // TODO: object URLs are local, in-browser-memory only — not real
      // uploads. Swap for real Firebase Storage URLs once the admin data
      // layer exists.
      imageUrl: displayImageUrl,
    };

    if (isEditMode) {
      updateVehicle(id, vehicleData);
    } else {
      addVehicle(vehicleData);
    }

    navigate("/admin/vehicles");
  };

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <Link to="/admin/vehicles" className={styles.backLink}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Vehicles
        </Link>
        <h1 className={styles.title}>{isEditMode ? "Edit Vehicle" : "Add Vehicle"}</h1>
        <p className={styles.subtitle}>
          Temporary form — will be replaced once the real {isEditMode ? "Edit" : "Add"} Vehicle design is ready.
        </p>
      </div>

      <form className={styles.card} onSubmit={handleSubmit}>
        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Vehicle Photo</label>

          {displayImageUrl ? (
            <div className={styles.imagePreviewWrap}>
              <img src={displayImageUrl} alt="Vehicle preview" className={styles.imagePreview} />
              <button type="button" className={styles.removeImageBtn} onClick={handleRemoveImage}>
                Remove Photo
              </button>
            </div>
          ) : (
            <label className={styles.uploadDropzone}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V4M8 8l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={styles.uploadText}>Click to upload a photo</span>
              <span className={styles.uploadHint}>PNG or JPG, up to {MAX_IMAGE_SIZE_MB}MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.hiddenFileInput}
                onChange={handleImageSelect}
              />
            </label>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Vehicle Name
            </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              placeholder="e.g. Toyota Fortuner"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="plate">
              Plate Number
            </label>
            <input
              id="plate"
              type="text"
              className={styles.input}
              placeholder="e.g. ABC 1234"
              value={form.plate}
              onChange={(e) => updateField("plate", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="transmission">
              Transmission
            </label>
            <select
              id="transmission"
              className={styles.select}
              value={form.transmission}
              onChange={(e) => updateField("transmission", e.target.value)}
            >
              <option>Automatic</option>
              <option>Manual</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="seats">
              Seats
            </label>
            <input
              id="seats"
              type="number"
              min="1"
              max="20"
              className={styles.input}
              value={form.seats}
              onChange={(e) => updateField("seats", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="type">
              Vehicle Type
            </label>
            <select
              id="type"
              className={styles.select}
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
            >
              {VEHICLE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className={styles.select}
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              {VEHICLE_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="price">
            Price per Day (₱)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="50"
            className={styles.input}
            placeholder="e.g. 1800"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Link to="/admin/vehicles" className={styles.cancelBtn}>
            Cancel
          </Link>
          <button type="submit" className={styles.submitBtn}>
            {isEditMode ? "Save Changes" : "Add Vehicle"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}