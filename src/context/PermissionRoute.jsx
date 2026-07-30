import { Navigate } from "react-router-dom";
import { useStaff } from "./StaffContext";

// Must be nested inside AdminRoute — assumes staff existence is already
// guaranteed, only checks the specific permission.
export default function PermissionRoute({ permission, children }) {
  const { hasPermission } = useStaff();

  if (!hasPermission(permission)) {
    return (
      <Navigate to="/admin/dashboard" replace state={{ notAuthorized: true }} />
    );
  }
  return children;
}
