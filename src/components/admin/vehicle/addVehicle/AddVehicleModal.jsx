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

const EMPTY_FORM = {
  carName: "",
  brand: "",
  model: "",
  type: "",
  transmission: "Automatic",
  seats: "",
  fuelType: "",
  features: [],
  description: "",
  dailyRate: "",
  rate12h: "",
};

const EMPTY_PHOTOS = [null, null, null, null, null];

export default function AddVehicleModal({ onClose }) {
  const { addVehicle } = useAdminVehicles();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photos, setPhotos] = useState(EMPTY_PHOTOS);
  const [error, setError] = useState("");
  const photosRef = useRef(photos);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Revoke every still-live object URL when the modal unmounts, whether
  // that's from closing or from saving successfully.
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => {
        if (p) URL.revokeObjectURL(p.previewUrl);
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
      if (next[index]) URL.revokeObjectURL(next[index].previewUrl);
      next[index] = { previewUrl: URL.createObjectURL(file) };
      return next;
    });
  };

  const handlePhotoRemove = (index) => {
    setPhotos((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index].previewUrl);
      next[index] = null;
      return next;
    });
  };

  const validateStep = () => {
    if (step === 1) {
      if (
        !form.carName.trim() ||
        !form.brand ||
        !form.model.trim() ||
        !form.type
      ) {
        return "Car name, brand, model, and type are required.";
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

  const handleSave = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    const firstPhoto = photos.find(Boolean);

    addVehicle({
      // TODO: this design has no plate/license-number field anywhere in
      // the wizard — every other vehicle in mock data has one, and
      // VehicleCard displays it. Using a placeholder until a plate field
      // is added to Basic Info.
      plate: "—",
      name: form.carName.trim(),
      brand: form.brand,
      model: form.model.trim(),
      type: form.type,
      transmission: form.transmission,
      seats: Number(form.seats),
      fuelType: form.fuelType,
      features: form.features,
      description: form.description,
      price: Number(form.dailyRate),
      rate12h: form.rate12h ? Number(form.rate12h) : null,
      status: "Available",
      imageUrl: firstPhoto ? firstPhoto.previewUrl : null,
    });

    onClose();
  };

  const photoCount = photos.filter(Boolean).length;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Add New Vehicle</h1>
            <p className={styles.subtitle}>
              Fill in the information to add a new vehicle to your showroom.
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
          <span className={styles.draftText}>Draft saved automatically</span>
          <div className={styles.footerActions}>
            {step > 1 && (
              <button
                type="button"
                className={styles.backBtn}
                onClick={handleBack}
              >
                Back
              </button>
            )}
            {step < 5 ? (
              <button
                type="button"
                className={styles.nextBtn}
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className={styles.nextBtn}
                onClick={handleSave}
              >
                Save Vehicle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
