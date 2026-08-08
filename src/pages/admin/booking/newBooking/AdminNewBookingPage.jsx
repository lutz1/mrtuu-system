import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../dashboard/AdminLayout";
import VehicleSelectionStep from "../../../../components/admin/booking/newBooking/VehicleSelectionStep";
import BookingDetailsStep from "../../../../components/admin/booking/newBooking/BookingDetailsStep";
import { useAdminBookings } from "../../../../context/AdminBookingsContext";
import { useToast } from "../../../../context/ToastContext";
import fields from "../../../../components/admin/booking/newBooking/FormFields.module.css";
import styles from "./AdminNewBookingPage.module.css";

const EMPTY_FORM = {
  fullName: "",
  contactNumber: "",
  email: "",
  address: "",
  licenseNumber: "",
  licenseExpiry: "",
  idType: "",
  pickupDate: "",
  returnDate: "",
  pickupTime: "",
  returnTime: "",
  securityDeposit: "0",
  paymentMethod: "",
  paymentStatus: "",
  remarks: "",
};

function calcDays(pickupDate, returnDate) {
  if (!pickupDate || !returnDate) return 1;
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeDisplay(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export default function AdminNewBookingPage() {
  const navigate = useNavigate();
  const { addBooking } = useAdminBookings();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState({ license: null, validId: null });
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (key, file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("Each uploaded file must be smaller than 5MB.");
      return;
    }
    setError("");
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleFileRemove = (key) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setStep(2);
    setError("");
  };

  const numDays = calcDays(form.pickupDate, form.returnDate);
  const totalAmount = selectedVehicle ? selectedVehicle.price * numDays : 0;

  const validate = () => {
    if (
      !form.fullName.trim() ||
      !form.contactNumber.trim() ||
      !form.address.trim() ||
      !form.licenseNumber.trim() ||
      !form.licenseExpiry ||
      !files.license ||
      !form.idType ||
      !files.validId ||
      !form.pickupDate ||
      !form.returnDate ||
      !form.pickupTime ||
      !form.returnTime ||
      !form.paymentMethod ||
      !form.paymentStatus
    ) {
      return "Please fill in all required fields before creating this booking.";
    }
    return "";
  };

  const handleCancel = () => {
    navigate("/admin/bookings");
  };

  const handleCreateBooking = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const newBooking = await addBooking({
        customer: form.fullName.trim(),
        phone: form.contactNumber.trim(),
        email: form.email.trim(),
        licenseNumber: form.licenseNumber.trim(),
        vehicleId: selectedVehicle.id,
        location: form.address.trim(),
        pickupDate: form.pickupDate,
        returnDate: form.returnDate,
        pickupTime: form.pickupTime,
        returnTime: form.returnTime,
        days: numDays,
        dailyRate: selectedVehicle.price,
        total: totalAmount,
      });

      showToast(`Booking ${newBooking.id} created successfully.`, {
        type: "success",
      });
      navigate("/admin/bookings");
    } catch (err) {
      console.error("Failed to create booking:", err);
      setError("Failed to create booking. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <p className={styles.breadcrumb}>
          <Link to="/admin/bookings" className={styles.breadcrumbLink}>
            Bookings
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span>New Booking</span>
        </p>
        <h1 className={styles.title}>New Booking (Walk-in)</h1>
        <p className={styles.subtitle}>
          {step === 1
            ? "Step 1 of 2: Select an available vehicle for this booking."
            : "Step 2 of 2: Fill in customer, driver, and rental details."}
        </p>
      </div>

      {error && (
        <p className={`${fields.errorText} ${styles.pageError}`}>{error}</p>
      )}

      {step === 1 ? (
        <VehicleSelectionStep onSelectVehicle={handleSelectVehicle} />
      ) : (
        <>
          <BookingDetailsStep
            vehicle={selectedVehicle}
            form={form}
            updateField={updateField}
            files={files}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            numDays={numDays}
            totalAmount={totalAmount}
            onChangeVehicle={() => setStep(1)}
          />

          <div className={styles.stickyFooter}>
            <span className={styles.footerNote}>
              Field marked with * are required.
            </span>
            <div className={styles.footerActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.createBtn}
                onClick={handleCreateBooking}
              >
                Create Booking
              </button>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
