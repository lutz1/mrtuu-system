import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getAuthRedirect, clearAuthRedirect } from "./authRedirect";

// Where a user lands right after they authenticate — used by both the
// login/signup submit handlers and RequireGuest's already-logged-in check.
// Staff accounts always go to their dashboard; a pending returnTo is only
// honored for plain customers.
export async function resolvePostAuthDestination(uid) {
  try {
    const staffSnap = await getDoc(doc(db, "lykas_staff", uid));
    if (staffSnap.exists() && staffSnap.data().active === true) {
      const { role } = staffSnap.data();
      clearAuthRedirect();
      return {
        path:
          role === "dispatcher" ? "/dispatcher/dashboard" : "/admin/dashboard",
      };
    }
  } catch (err) {
    console.error("Staff role check failed", err);
  }

  const redirect = getAuthRedirect();
  clearAuthRedirect();
  if (redirect?.path) {
    return { path: redirect.path, state: redirect.state || undefined };
  }
  return { path: "/" };
}
