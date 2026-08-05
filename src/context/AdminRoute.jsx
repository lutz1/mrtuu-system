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
  // Dispatchers have a valid staffProfile but belong in /dispatcher/*, not /admin/*
  if (staffProfile.role === "dispatcher") {
    return <Navigate to="/dispatcher/dashboard" replace />;
  }
  return children;
}
