import { Navigate } from "react-router-dom";
import { useDispatcherAuth } from "./DispatcherAuthContext";

// TODO: TEMPORARY guard, checking only the dummy session flag.
export default function DispatcherRoute({ children }) {
  const { isDispatcherLoggedIn } = useDispatcherAuth();

  if (!isDispatcherLoggedIn) {
    return <Navigate to="/dispatcher/login" replace />;
  }

  return children;
}