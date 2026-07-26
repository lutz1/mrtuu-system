import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from "../components/user/Loading";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, authLoading } = useAuth();

  if (authLoading) {
    return <Loading message="Checking your session..." />;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
