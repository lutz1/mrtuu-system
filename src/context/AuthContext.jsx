import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
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
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

const AuthContext = createContext(null);

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

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(credential.user, { displayName: name });
    }
    // Firebase's native email "verification" is a clickable link sent to
    // the inbox — not a 6-digit code. This is what Firebase actually offers.
    await sendEmailVerification(credential.user);
    return credential;
  };

  const resendVerificationEmail = () => {
    if (!auth.currentUser) {
      throw new Error("No signed-in user to verify.");
    }
    return sendEmailVerification(auth.currentUser);
  };

  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    return signOut(auth);
  };

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
      recaptchaVerifiers.current[containerId] = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
      });
    }
    return recaptchaVerifiers.current[containerId];
  };

  const sendPhoneOTP = async (phoneNumber, containerId) => {
    const verifier = getRecaptchaVerifier(containerId);
    return signInWithPhoneNumber(auth, phoneNumber, verifier);
  };

  const confirmPhoneOTP = (confirmationResult, code) => {
    return confirmationResult.confirm(code);
  };

  // Check whether the current user has verified their email.
  const checkEmailVerified = async () => {
    if (!auth.currentUser) {
      throw new Error("No active session — please log in again to verify.");
    }
    await auth.currentUser.reload();
    return auth.currentUser.emailVerified;
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