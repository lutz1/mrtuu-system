import { Navigate } from "react-router-dom";
import { useStaff } from "./StaffContext";
import Loading from "../components/user/Loading";

// Strict role guard: only active staff with role === "dispatcher" may pass.
// Owners/staff/checklist_admins are bounced to /admin/dashboard instead of
// silently being let in, since they DO have a valid staffProfile.
export default function DispatcherRoute({ children }) {
  const { staffProfile, staffLoading } = useStaff();

  if (staffLoading) {
    return <Loading message="Checking dispatcher access..." />;
  }
  if (!staffProfile) {
    return <Navigate to="/login" replace />;
  }
  if (staffProfile.role !== "dispatcher") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}
