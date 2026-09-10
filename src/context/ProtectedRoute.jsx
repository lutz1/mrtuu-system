import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from "../components/user/Loading";
import { setAuthRedirect } from "../utils/authRedirect";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <Loading message="Checking your session..." />;
  }
  if (!isLoggedIn) {
    setAuthRedirect(location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }
  return children;
}
