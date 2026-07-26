import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";

// TODO: TEMPORARY guard, checking only the dummy AdminAuthContext session
// flag. Swap isAdminLoggedIn for a real role/claim check once admin auth
// is properly designed — this component's shape (redirect if not
// authorized) should stay the same, only the check inside changes.
export default function AdminRoute({ children }) {
  const { isAdminLoggedIn } = useAdminAuth();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}