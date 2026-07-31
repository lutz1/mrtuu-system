import { Navigate, useParams } from "react-router-dom";

// This standalone single-image form has been superseded by AddVehicleModal
// (real Firestore + Storage backed, 5-photo upload) hosted on
// AdminVehiclesPage. Rather than duplicate that logic here, both
// /admin/vehicles/new and /admin/vehicles/:id/edit now redirect there and
// hand off which modal state to open via router state.
export default function AdminAddVehiclePage() {
  const { id } = useParams();

  return (
    <Navigate
      to="/admin/vehicles"
      replace
      state={id ? { editVehicleId: id } : { openAddModal: true }}
    />
  );
}
