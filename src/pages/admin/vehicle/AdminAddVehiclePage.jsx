import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminLayout from "../dashboard/AdminLayout";
import { useAdminVehicles } from "../../../context/AdminVehiclesContext";
import {
  VEHICLE_STATUSES,
  VEHICLE_TYPES,
} from "../../../data/admin/mockVehicles";
import styles from "./AdminAddVehiclePage.module.css";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid"];
const IMAGE_SLOTS = 5;
const MAX_IMAGE_SIZE_MB = 5;

const EMPTY_FORM = {
  name: "",
  brand: "",
  model: "",
  plate: "",
  transmission: "Automatic",
  carType: VEHICLE_TYPES[0],
  seats: 5,
  fuelType: "Petrol",
  mileage: "",
  price: "",
  status: "Available",
  description: "",
  features: "", // comma-separated in the form, split into an array on submit
};

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
          brand: existingVehicle.brand,
          model: existingVehicle.model,
          plate: existingVehicle.plate,
          transmission: existingVehicle.transmission,
          carType: existingVehicle.carType,
          seats: existingVehicle.seats,
          fuelType: existingVehicle.fuelType,
          mileage: existingVehicle.mileage,
          price: existingVehicle.price,
          status: existingVehicle.status,
          description: existingVehicle.description,
          features: (existingVehicle.features || []).join(", "),
        }
      : EMPTY_FORM
  );

  // 5 fixed slots. Each holds either an existing image URL (string) or a
  // freshly-picked File pending upload. previews mirror it for display.
  const [imageSlots, setImageSlots] = useState(() => {
    const existing = existingVehicle?.images ?? [];
    return Array.from({ length: IMAGE_SLOTS }, (_, i) => existing[i] ?? null);
  });
  const [previews, setPreviews] = useState(() =>
    imageSlots.map((s) => (typeof s === "string" ? s : null))
  );

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRefs = useRef([]);

  useEffect(() => {
    return () => {
      previews.forEach((p, i) => {
        if (imageSlots[i] instanceof File && p) URL.revokeObjectURL(p);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isEditMode && !existingVehicle) {
    return (
      <AdminLayout>
        <div className={styles.pageHeading}>
          <Link to="/admin/vehicles" className={styles.backLink}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Vehicles
          </Link>
          <h1 className={styles.title}>Vehicle not found</h1>
        </div>
      </AdminLayout>
    );
  }

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageSelect = (slotIndex, e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
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
    setImageSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = file;
      return next;
    });
    setPreviews((prev) => {
      const next = [...prev];
      if (prev[slotIndex] && imageSlots[slotIndex] instanceof File) {
        URL.revokeObjectURL(prev[slotIndex]);
      }
      next[slotIndex] = URL.createObjectURL(file);
      return next;
    });
  };

  const handleRemoveImage = (slotIndex) => {
    setImageSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setPreviews((prev) => {
      const next = [...prev];
      if (prev[slotIndex] && imageSlots[slotIndex] instanceof File) {
        URL.revokeObjectURL(prev[slotIndex]);
      }
      next[slotIndex] = null;
      return next;
    });
    if (fileInputRefs.current[slotIndex])
      fileInputRefs.current[slotIndex].value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.brand.trim() ||
      !form.plate.trim() ||
      !form.price
    ) {
      setError("Vehicle name, brand, plate number, and price are required.");
      return;
    }
    if (imageSlots.some((slot) => !slot)) {
      setError("All 5 vehicle images are required.");
      return;
    }

    const vehicleData = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      plate: form.plate.trim().toUpperCase(),
      transmission: form.transmission,
      carType: form.carType,
      seats: Number(form.seats),
      fuelType: form.fuelType,
      mileage: Number(form.mileage) || 0,
      price: Number(form.price),
      status: form.status,
      description: form.description.trim(),
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    setSubmitting(true);
    try {
      if (isEditMode) {
        // Only pass images if the user actually changed at least one slot —
        // otherwise skip re-uploading unchanged existing URLs.
        const changed = imageSlots.some((slot) => slot instanceof File);
        await updateVehicle(id, vehicleData, changed ? imageSlots : undefined);
      } else {
        await addVehicle(vehicleData, imageSlots);
      }
      navigate("/admin/vehicles");
    } catch (err) {
      console.error("Failed to save vehicle:", err);
      setError(err.message || "Something went wrong saving this vehicle.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <Link to="/admin/vehicles" className={styles.backLink}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Vehicles
        </Link>
        <h1 className={styles.title}>
          {isEditMode ? "Edit Vehicle" : "Add Vehicle"}
        </h1>
      </div>

      <form className={styles.card} onSubmit={handleSubmit}>
        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Vehicle Photos (5 required)</label>
          <div className={styles.imageGrid}>
            {imageSlots.map((slot, i) => (
              <div key={i} className={styles.imageSlot}>
                {previews[i] ? (
                  <div className={styles.imagePreviewWrap}>
                    <img
                      src={previews[i]}
                      alt={`Slot ${i + 1}`}
                      className={styles.imagePreview}
                    />
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => handleRemoveImage(i)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className={styles.uploadDropzone}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15V4M8 8l4-4 4 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className={styles.uploadText}>Photo {i + 1}</span>
                    <input
                      ref={(el) => (fileInputRefs.current[i] = el)}
                      type="file"
                      accept="image/*"
                      className={styles.hiddenFileInput}
                      onChange={(e) => handleImageSelect(i, e)}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
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
            <label className={styles.label} htmlFor="brand">
              Brand
            </label>
            <input
              id="brand"
              type="text"
              className={styles.input}
              placeholder="e.g. Toyota"
              value={form.brand}
              onChange={(e) => updateField("brand", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="model">
              Model / Trim / Year
            </label>
            <input
              id="model"
              type="text"
              className={styles.input}
              placeholder="e.g. Fortuner 2024 GR-Sport"
              value={form.model}
              onChange={(e) => updateField("model", e.target.value)}
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
            <label className={styles.label} htmlFor="carType">
              Car Type
            </label>
            <select
              id="carType"
              className={styles.select}
              value={form.carType}
              onChange={(e) => updateField("carType", e.target.value)}
            >
              {VEHICLE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
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
          <div className={styles.field}>
            <label className={styles.label} htmlFor="fuelType">
              Fuel Type
            </label>
            <select
              id="fuelType"
              className={styles.select}
              value={form.fuelType}
              onChange={(e) => updateField("fuelType", e.target.value)}
            >
              {FUEL_TYPES.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="mileage">
              Mileage (km)
            </label>
            <input
              id="mileage"
              type="number"
              min="0"
              className={styles.input}
              placeholder="e.g. 15000"
              value={form.mileage}
              onChange={(e) => updateField("mileage", e.target.value)}
            />
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

        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">
            About This Vehicle
          </label>
          <textarea
            id="description"
            className={styles.input}
            rows={4}
            placeholder="Short description shown on the vehicle overview page"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="features">
            Features (comma-separated)
          </label>
          <textarea
            id="features"
            className={styles.input}
            rows={2}
            placeholder="e.g. Bluetooth, Air Conditioning, Cruise Control"
            value={form.features}
            onChange={(e) => updateField("features", e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Link to="/admin/vehicles" className={styles.cancelBtn}>
            Cancel
          </Link>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : isEditMode
              ? "Save Changes"
              : "Add Vehicle"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
