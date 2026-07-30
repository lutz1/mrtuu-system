import { Navigate } from "react-router-dom";
import { useStaff } from "./StaffContext";
import Loading from "../components/user/Loading";

export default function AdminRoute({ children }) {
  const { staffProfile, staffLoading } = useStaff();

  if (staffLoading) {
    return <Loading message="Checking staff access..." />;
  }
  if (!staffProfile) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
