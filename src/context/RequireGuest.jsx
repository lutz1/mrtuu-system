// src/context/RequireGuest.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from "../components/user/Loading";
import { resolvePostAuthDestination } from "../utils/postAuthRoute";

// Blocks /login and /signup for anyone already authenticated when they land
// on the route. Checks exactly once per mount, right after the initial auth
// state resolves — it does NOT react to a login/signup happening on this
// same page, since LoginPage/SignupPage own that redirect themselves.
// Without the once-only guard, both this effect and the page's own submit
// handler race to consume the same stored redirect, and whichever navigates
// last wins — usually this effect, sending the user to "/" instead of
// /booking/:id.
export default function RequireGuest({ children }) {
  const { user, isLoggedIn, authLoading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (authLoading || checkedRef.current) return;
    checkedRef.current = true;

    if (!isLoggedIn || !user) return;

    setRedirecting(true);
    resolvePostAuthDestination(user.uid).then(({ path, state }) => {
      navigate(path, state ? { state, replace: true } : { replace: true });
    });
  }, [authLoading, isLoggedIn, user, navigate]);

  if (authLoading || redirecting) {
    return <Loading message="Redirecting..." />;
  }
  return children;
}
