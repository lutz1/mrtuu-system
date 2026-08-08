import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStaff } from "../context/StaffContext";
import Loading from "../components/user/Loading";
import LandingPage from "./user/landing_page/LandingPage";

export default function RootRedirect() {
  const { isLoggedIn, authLoading } = useAuth();
  const { staffProfile, staffLoading } = useStaff();

  if (authLoading || (isLoggedIn && staffLoading)) {
    return <Loading message="Loading..." />;
  }

  if (isLoggedIn && staffProfile) {
    const target =
      staffProfile.role === "dispatcher"
        ? "/dispatcher/dashboard"
        : "/admin/dashboard";
    return <Navigate to={target} replace />;
  }

  return <LandingPage />;
}
