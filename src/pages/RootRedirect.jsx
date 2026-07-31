import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStaff } from "../context/StaffContext";
import Loading from "../components/user/Loading";
import LandingPage from "./user/landing_page/LandingPage";

export default function RootRedirect() {
  const { isLoggedIn, authLoading } = useAuth();
  const { staffProfile, staffLoading } = useStaff();

  // Wait for auth to resolve, and — only if logged in — wait for the
  // staff lookup too, before deciding where to send them.
  if (authLoading || (isLoggedIn && staffLoading)) {
    return <Loading message="Loading..." />;
  }

  if (isLoggedIn && staffProfile) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <LandingPage />;
}
