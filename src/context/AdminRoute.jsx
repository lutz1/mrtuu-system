import { Navigate } from "react-router-dom";
import { useStaff } from "./StaffContext";
import Loading from "../components/user/Loading";
import { useAuth } from "./AuthContext";

export default function AdminRoute({ children }) {
  const { authLoading } = useAuth();
  const { staffProfile, staffLoading } = useStaff();

  if (authLoading || staffLoading) {
    return <Loading message="Loading access..." />;
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
