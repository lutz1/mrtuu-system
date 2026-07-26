import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  signOut,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
  deleteUser,
} from "firebase/auth";
import { auth, db, googleProvider } from "../lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

async function upsertSharedUserDoc(user, extra = {}) {
  if (!user) return;
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      displayName: user.displayName || null,
      email: user.email || null,
      phoneNumber: user.phoneNumber || null,
      photoURL: user.photoURL || null,
      lastLoginAt: serverTimestamp(),
      createdBy: extra.createdBy || "lykas", // which app first created this identity
      authProviders: user.providerData.map((p) => p.providerId),
    },
    { merge: true }
  );
}

function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

async function signup(name, email, password) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  if (name) await updateProfile(credential.user, { displayName: name });
  await sendEmailVerification(credential.user);
  await upsertSharedUserDoc(credential.user, { createdBy: "lykas" });
  return credential;
}

function resendVerificationEmail() {
  if (!auth.currentUser) {
    throw new Error("No signed-in user to verify.");
  }
  return sendEmailVerification(auth.currentUser);
}

async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await upsertSharedUserDoc(result.user, { createdBy: "lykas" });
  return result;
}

function logout() {
  return signOut(auth);
}

function confirmPhoneOTP(confirmationResult, code) {
  return confirmationResult.confirm(code);
}

// Check whether the current user has verified their email.
async function checkEmailVerified() {
  if (!auth.currentUser) {
    throw new Error("No active session — please log in again to verify.");
  }
  await auth.currentUser.reload();
  return auth.currentUser.emailVerified;
}

// Firebase requires a "recent" login before sensitive operations
// (updatePassword, verifyBeforeUpdateEmail, deleteUser) will succeed.
// Google-only accounts have no password on file, so we re-run the Google
// popup instead of asking for a password that doesn't exist.
async function reauthenticate(currentPassword) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No active session — please log in again to continue.");
  }

  const isPasswordUser = currentUser.providerData.some(
    (p) => p.providerId === "password"
  );

  if (isPasswordUser) {
    if (!currentPassword) {
      throw new Error("Current password is required.");
    }
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    return reauthenticateWithCredential(currentUser, credential);
  }

  // Google (or other popup-based) provider — re-run the popup flow.
  return signInWithPopup(currentUser, googleProvider);
}

// Change the signed-in user's password. Requires reauthentication first
// since Firebase rejects updatePassword() on a "stale" session.
async function changePassword(currentPassword, newPassword) {
  await reauthenticate(currentPassword);
  await updatePassword(auth.currentUser, newPassword);
}

// Change the signed-in user's email. Firebase's modern flow sends a
// verification link to the NEW address first — the email doesn't actually
// change on auth.currentUser until the user clicks that link.
async function changeEmail(currentPassword, newEmail) {
  await reauthenticate(currentPassword);
  await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
  // Keep the shared users/{uid} doc's lastLoginAt fresh; the email field
  // itself is intentionally NOT updated here since Firebase hasn't
  // committed the change yet — it'll be correct next time upsertSharedUserDoc
  // runs after the user re-authenticates post-verification.
}

// Permanently delete the signed-in user's Firebase Auth account.
// NOTE: this only removes the Auth record. Associated Firestore docs
// (users/{uid}, lykas_customers/{uid}, lykas_bookings, etc.) are NOT
// cleaned up here — that needs a Cloud Function (onDelete trigger) or a
// batched client-side cleanup call before/after this, per the data model
// in the architecture doc.
async function deleteAccount(currentPassword) {
  await reauthenticate(currentPassword);
  await deleteUser(auth.currentUser);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const recaptchaVerifiers = useRef({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Phone auth requires an invisible reCAPTCHA bound to a real DOM node
  // before Firebase will send an SMS. containerId must match an element
  // already rendered on the page, e.g. <div id="login-recaptcha-container" />.
  //
  // NOTE: RecaptchaVerifier's argument order differs between Firebase SDK
  // versions. This uses the v10+ order (auth, containerId, options). If you're
  // on Firebase SDK v9, flip to (containerId, options, auth) instead —
  // check your package.json "firebase" version if this throws at runtime.
  const getRecaptchaVerifier = (containerId) => {
    if (!recaptchaVerifiers.current[containerId]) {
      recaptchaVerifiers.current[containerId] = new RecaptchaVerifier(
        auth,
        containerId,
        {
          size: "invisible",
        }
      );
    }
    return recaptchaVerifiers.current[containerId];
  };

  const sendPhoneOTP = async (phoneNumber, containerId) => {
    const verifier = getRecaptchaVerifier(containerId);
    return signInWithPhoneNumber(auth, phoneNumber, verifier);
  };

  // Firebase's updateProfile() mutates auth.currentUser in place rather than
  // returning a new object, so React won't re-render off that alone. Call
  // this after any updateProfile() (photoURL, displayName, etc.) to force a
  // fresh reference and re-render every consumer of `user`.
  const refreshUser = useCallback(() => {
    if (auth.currentUser) {
      setUser({ ...auth.currentUser });
    }
  }, []);

  const value = {
    user,
    isLoggedIn: !!user,
    authLoading,
    login,
    signup,
    loginWithGoogle,
    logout,
    resendVerificationEmail,
    sendPhoneOTP,
    confirmPhoneOTP,
    checkEmailVerified,
    refreshUser,
    changePassword,
    changeEmail,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
