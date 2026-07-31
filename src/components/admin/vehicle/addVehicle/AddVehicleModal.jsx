import { useEffect, useRef, useState } from "react";
import { useAdminVehicles } from "../../../../context/AdminVehiclesContext";
import StepIndicator from "./StepIndicator";
import BasicInfoStep from "./BasicInfoStep";
import SpecificationsStep from "./SpecificationsStep";
import FeaturesStep from "./FeaturesStep";
import PricingStep from "./PricingStep";
import ReviewStep from "./ReviewStep";
import fields from "./FormFields.module.css";
import styles from "./AddVehicleModal.module.css";

const REQUIRED_IMAGE_COUNT = 5;

const EMPTY_FORM = {
  carName: "",
  plate: "",
  brand: "",
  model: "",
  type: "",
  yearModel: "",
  color: "",
  transmission: "Automatic",
  seats: "",
  fuelType: "",
  variant: "",
  engine: "",
  fuelCapacity: "",
  mileage: "",
  doors: "",
  drivetrain: "",
  features: [],
  description: "",
  dailyRate: "",
  rate12h: "",
};

const EMPTY_PHOTOS = [null, null, null, null, null];

function formFromVehicle(vehicle) {
  return {
    carName: vehicle.name ?? "",
    plate: vehicle.plate ?? "",
    brand: vehicle.brand ?? "",
    model: vehicle.model ?? "",
    type: vehicle.type ?? "",
    yearModel: vehicle.yearModel ?? "",
    color: vehicle.color ?? "",
    transmission: vehicle.transmission ?? "Automatic",
    seats: vehicle.seats ?? "",
    fuelType: vehicle.fuelType ?? "",
    variant: vehicle.variant ?? "",
    engine: vehicle.engine ?? "",
    fuelCapacity: vehicle.fuelCapacity ?? "",
    mileage: vehicle.mileage ?? "",
    doors: vehicle.doors ?? "",
    drivetrain: vehicle.drivetrain ?? "",
    features: vehicle.features ?? [],
    description: vehicle.description ?? "",
    dailyRate: vehicle.price ?? "",
    rate12h: vehicle.rate12h ?? "",
  };
}

function toDate(value) {
  if (!value) return null;
  // Firestore Timestamp has .toDate(); a plain JS Date does not.
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function formatTimestamp(date) {
  if (!date) return null;
  const datePart = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart} ${timePart}`;
}

function photosFromVehicle(vehicle) {
  const photos = [...EMPTY_PHOTOS];
  const sourceImages = vehicle.images?.length ? vehicle.images : vehicle.imageUrl ? [vehicle.imageUrl] : [];
  sourceImages.slice(0, 5).forEach((url, i) => {
    // isNew: false — these URLs may already be rendering elsewhere (the
    // vehicle's card, or the View overlay behind this modal), so they
    // must never be revoked unless the admin actively replaces or
    // removes them in this session.
    photos[i] = { previewUrl: url, isNew: false };
  });
  return photos;
}

export default function AddVehicleModal({ vehicle, onClose }) {
  const { addVehicle, updateVehicle } = useAdminVehicles();
  const isEditMode = Boolean(vehicle);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() =>
    isEditMode ? formFromVehicle(vehicle) : EMPTY_FORM
  );
  const [photos, setPhotos] = useState(() =>
    isEditMode ? photosFromVehicle(vehicle) : EMPTY_PHOTOS
  );
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() =>
    isEditMode ? toDate(vehicle.updatedAt) : null
  );
  const photosRef = useRef(photos);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // On unmount, revoke only photos picked during THIS session (isNew).
  // Existing vehicle photos passed in via props are never revoked here —
  // they aren't this modal's to release, since other views may still
  // depend on them.
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => {
        if (p?.isNew) URL.revokeObjectURL(p.previewUrl);
      });
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoSelect = (index, file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Each photo must be smaller than 5MB.");
      return;
    }
    setError("");
    setPhotos((prev) => {
      const next = [...prev];
      if (next[index]?.isNew) URL.revokeObjectURL(next[index].previewUrl);
      next[index] = {
        previewUrl: URL.createObjectURL(file),
        isNew: true,
        file,
      };
      return next;
    });
  };

  const handlePhotoRemove = (index) => {
    setPhotos((prev) => {
      const next = [...prev];
      if (next[index]?.isNew) URL.revokeObjectURL(next[index].previewUrl);
      next[index] = null;
      return next;
    });
  };

  const validateStep = () => {
    if (step === 1) {
      if (
        !form.carName.trim() ||
        !form.plate.trim() ||
        !form.brand ||
        !form.model.trim() ||
        !form.type
      ) {
        return "Car name, license plate, brand, model, and type are required.";
      }
      if (photos.filter(Boolean).length < REQUIRED_IMAGE_COUNT) {
        return `All ${REQUIRED_IMAGE_COUNT} vehicle photos are required.`;
      }
    }
    if (step === 2) {
      if (!form.seats || !form.fuelType) {
        return "Seats and fuel type are required.";
      }
    }
    if (step === 4) {
      if (!form.dailyRate) {
        return "Daily rate is required.";
      }
    }
    return "";
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSave = async () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    const photoUrls = photos.filter(Boolean).map((p) => p.previewUrl);
    const now = new Date();

    const vehicleData = {
      plate: form.plate.trim(),
      name: form.carName.trim(),
      brand: form.brand,
      model: form.model.trim(),
      type: form.type,
      yearModel: form.yearModel ? Number(form.yearModel) : null,
      color: form.color,
      transmission: form.transmission,
      seats: Number(form.seats),
      fuelType: form.fuelType,
      variant: form.variant,
      engine: form.engine,
      fuelCapacity: form.fuelCapacity ? Number(form.fuelCapacity) : null,
      mileage: form.mileage ? Number(form.mileage) : null,
      doors: form.doors ? Number(form.doors) : null,
      drivetrain: form.drivetrain,
      features: form.features,
      description: form.description,
      price: Number(form.dailyRate),
      rate12h: form.rate12h ? Number(form.rate12h) : null,
      status: isEditMode ? vehicle.status : "Available",
      imageUrl: photoUrls[0] ?? null,
      images: photoUrls,
      updatedAt: now,
    };

      if (isEditMode) {
        await updateVehicle(vehicle.id, vehicleData, images);
      } else {
        await addVehicle(vehicleData, images);
      }

      setLastUpdatedAt(new Date());
      onClose();
    } catch (err) {
      console.error("Failed to save vehicle:", err);
      setError(err.message || "Failed to save vehicle. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const photoCount = photos.filter(Boolean).length;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
            </h1>
            <p className={styles.subtitle}>
              {isEditMode
                ? "Update this vehicle's information."
                : "Fill in the information to add a new vehicle to your showroom."}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
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

        <div className={styles.body}>
          <StepIndicator currentStep={step} />

          <div className={styles.stepCard}>
            {error && <p className={fields.errorText}>{error}</p>}

            {step === 1 && (
              <BasicInfoStep
                form={form}
                updateField={updateField}
                photos={photos}
                onPhotoSelect={handlePhotoSelect}
                onPhotoRemove={handlePhotoRemove}
              />
            )}
            {step === 2 && (
              <SpecificationsStep form={form} updateField={updateField} />
            )}
            {step === 3 && (
              <FeaturesStep form={form} updateField={updateField} />
            )}
            {step === 4 && (
              <PricingStep form={form} updateField={updateField} />
            )}
            {step === 5 && <ReviewStep form={form} photoCount={photoCount} />}
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.draftText}>
            {isEditMode
              ? lastUpdatedAt
                ? `Last updated: ${formatTimestamp(lastUpdatedAt)}`
                : "No changes saved yet"
              : "Draft saved automatically"}
          </span>
          <div className={styles.footerActions}>
            {step > 1 && (
              <button
                type="button"
                className={styles.backBtn}
                onClick={handleBack}
                disabled={isSaving}
              >
                Back
              </button>
            )}
            {step < 5 ? (
              <button
                type="button"
                className={styles.nextBtn}
                onClick={handleNext}
                disabled={isSaving}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className={styles.nextBtn}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : isEditMode
                  ? "Save Changes"
                  : "Save Vehicle"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
