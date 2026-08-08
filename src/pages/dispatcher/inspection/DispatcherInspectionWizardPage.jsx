import { useEffect, useRef, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DispatcherLayout from "../DispatcherLayout";
import BookingInfoCard from "../../../components/dispatcher/inspection/wizard/BookingInfoCard";
import InspectionStepIndicator from "../../../components/dispatcher/inspection/wizard/InspectionStepIndicator";
import VehiclePhotosStep from "../../../components/dispatcher/inspection/wizard/VehiclePhotosStep";
import FuelDocumentsStep from "../../../components/dispatcher/inspection/wizard/FuelDocumentsStep";
import VehicleConditionStep from "../../../components/dispatcher/inspection/wizard/VehicleConditionStep";
import ReviewSubmitStep from "../../../components/dispatcher/inspection/wizard/ReviewSubmitStep";
import { useAdminBookings } from "../../../context/AdminBookingsContext";
import { useStaff } from "../../../context/StaffContext";
import { useToast } from "../../../context/ToastContext";
import { storage } from "../../../lib/firebase";
import styles from "./DispatcherInspectionWizardPage.module.css";

const EMPTY_PHOTOS = { front: null, back: null, left: null, right: null };
const EMPTY_DOCUMENTS = {
  orcr: "",
  insurance: "",
  officialReceipt: "",
  vehicleRegistration: "",
};
const DEFAULT_CONDITION = {
  exterior: "Good",
  interior: "Clean",
  tires: "Good",
  lights: "Working",
};

async function uploadChecklistPhoto(bookingId, phase, key, file) {
  const storageRef = ref(
    storage,
    `inspection-photos/${bookingId}/${phase}/${key}-${Date.now()}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export default function DispatcherInspectionWizardPage() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "return" ? "return" : "pickup"; // pickup -> preRent, return -> postRent
  const navigate = useNavigate();
  const { getBookingById, dispatchPreRent, dispatchPostRent } =
    useAdminBookings();
  const { staffProfile } = useStaff();
  const { showToast } = useToast();

  const booking = getBookingById(decodeURIComponent(bookingId));

  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState(EMPTY_PHOTOS);
  const [odometer, setOdometer] = useState("");
  const [fuelLevel, setFuelLevel] = useState("");
  const [documents, setDocuments] = useState(EMPTY_DOCUMENTS);
  const [condition, setCondition] = useState(DEFAULT_CONDITION);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photosRef = useRef(photos);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      Object.values(photosRef.current).forEach((p) => {
        if (p) URL.revokeObjectURL(p.previewUrl);
      });
    };
  }, []);

  if (!booking) {
    return (
      <DispatcherLayout>
        <div className={styles.pageHeading}>
          <Link to="/dispatcher/inspection" className={styles.breadcrumbLink}>
            Inspection
          </Link>
          <h1 className={styles.title}>Booking not found</h1>
          <p className={styles.subtitle}>
            This booking may not exist or hasn't finished loading yet.
          </p>
        </div>
      </DispatcherLayout>
    );
  }

  const handlePhotoSelect = (key, file) => {
    if (file.size > 8 * 1024 * 1024) {
      setError("Each photo must be smaller than 8MB.");
      return;
    }
    setError("");
    setPhotos((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key].previewUrl);
      return {
        ...prev,
        [key]: { previewUrl: URL.createObjectURL(file), file },
      };
    });
  };

  const handlePhotoRemove = (key) => {
    setPhotos((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key].previewUrl);
      return { ...prev, [key]: null };
    });
  };

  const handleDocumentChange = (key, value) => {
    setDocuments((prev) => ({ ...prev, [key]: value }));
  };

  const handleConditionChange = (key, value) => {
    setCondition((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = () => {
    if (step === 1) {
      const allPhotos = Object.values(photos).every(Boolean);
      if (!allPhotos || !odometer) {
        return "Please take all 4 vehicle photos and enter the odometer reading.";
      }
    }
    if (step === 2 && mode === "pickup") {
      const allDocs = Object.values(documents).every(Boolean);
      if (!fuelLevel || !allDocs) {
        return "Please select a fuel level and a status for every document.";
      }
    }
    if (step === 2 && mode === "return" && !fuelLevel) {
      return "Please select a fuel level.";
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
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCancel = () => {
    navigate("/dispatcher/inspection");
  };

  const handleSubmitClearance = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const phase = mode === "pickup" ? "preRent" : "postRent";
      const uploadedPhotos = {};
      for (const key of ["front", "back", "left", "right"]) {
        uploadedPhotos[key] = await uploadChecklistPhoto(
          booking.id,
          phase,
          key,
          photos[key].file
        );
      }

      if (mode === "pickup") {
        await dispatchPreRent(booking.id, {
          staffUid: staffProfile?.uid,
          vehicleId: booking.vehicleId,
          photos: uploadedPhotos,
          fuelLevel,
          odometerReading: odometer,
          notes: remarks,
        });
        showToast(
          `${booking.id} cleared for pickup — vehicle marked as rented.`,
          { type: "success" }
        );
      } else {
        await dispatchPostRent(booking.id, {
          staffUid: staffProfile?.uid,
          photos: uploadedPhotos,
          fuelLevel,
          odometerReading: odometer,
          notes: remarks,
        });
        showToast(
          `${booking.id} return checklist submitted — sent to admin for review.`,
          { type: "success" }
        );
      }

      navigate("/dispatcher/inspection");
    } catch (err) {
      console.error("Failed to submit checklist:", err);
      setError("Failed to submit inspection. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DispatcherLayout>
      <div className={styles.pageHeading}>
        <p className={styles.breadcrumb}>
          <Link to="/dispatcher/inspection" className={styles.breadcrumbLink}>
            Inspection
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span>
            {mode === "pickup" ? "Pre-Rent Inspection" : "Post-Rent Inspection"}
          </span>
        </p>
        <h1 className={styles.title}>Vehicle Inspection</h1>

        <InspectionStepIndicator currentStep={step} />

        <p className={styles.stepLabel}>
          Step {step} of 4
          <span className={styles.stepName}>
            {step === 1 && "Vehicle Photos"}
            {step === 2 &&
              (mode === "pickup" ? "Fuel & Documents" : "Fuel Level")}
            {step === 3 && "Vehicle Condition"}
            {step === 4 && "Review & Submit"}
          </span>
        </p>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.body}>
        <BookingInfoCard booking={booking} />

        <div className={styles.stepContent}>
          {step === 1 && (
            <VehiclePhotosStep
              photos={photos}
              onPhotoSelect={handlePhotoSelect}
              onPhotoRemove={handlePhotoRemove}
              odometer={odometer}
              onOdometerChange={setOdometer}
            />
          )}
          {step === 2 && (
            <FuelDocumentsStep
              fuelLevel={fuelLevel}
              onFuelLevelChange={setFuelLevel}
              documents={documents}
              onDocumentChange={handleDocumentChange}
            />
          )}
          {step === 3 && (
            <VehicleConditionStep
              condition={condition}
              onConditionChange={handleConditionChange}
            />
          )}
          {step === 4 && (
            <ReviewSubmitStep
              photos={photos}
              odometer={odometer}
              fuelLevel={fuelLevel}
              documents={documents}
              condition={condition}
              remarks={remarks}
              onRemarksChange={setRemarks}
            />
          )}
        </div>
      </div>

      <div className={styles.stickyFooter}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel Inspection
        </button>
        <div className={styles.footerActions}>
          {step > 1 && (
            <button
              type="button"
              className={styles.backBtn}
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          {step < 4 ? (
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
              onClick={handleSubmitClearance}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Clearance"}
            </button>
          )}
        </div>
      </div>
    </DispatcherLayout>
  );
}
