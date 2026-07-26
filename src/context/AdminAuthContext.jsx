import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext(null);

const STORAGE_KEY = "lyka-admin-session";

// TODO: TEMPORARY. There's no real admin auth/role system yet — this is a
// placeholder so the admin module can be built and navigated end-to-end,
// per the earlier decision to use dummy credentials for now. Replace with
// a real check (Firebase custom claim or a Firestore role field) before
// this ever ships. Never treat these credentials as real security —
// sessionStorage holding a plain "true" flag is trivially bypassable by
// anyone opening devtools.
const DUMMY_ADMIN_CREDENTIALS = {
  email: "admin@lyka.com",
  password: "admin123",
};

function getInitialSession() {
  return window.sessionStorage.getItem(STORAGE_KEY) === "true";
}

export function AdminAuthProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(getInitialSession);

  const adminLogin = (email, password) => {
    return new Promise((resolve, reject) => {
      const matches =
        email.trim().toLowerCase() === DUMMY_ADMIN_CREDENTIALS.email &&
        password === DUMMY_ADMIN_CREDENTIALS.password;

      if (matches) {
        window.sessionStorage.setItem(STORAGE_KEY, "true");
        setIsAdminLoggedIn(true);
        resolve();
      } else {
        reject(new Error("Invalid admin email or password."));
      }
    });
  };

  const adminLogout = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setIsAdminLoggedIn(false);
  };

  const value = { isAdminLoggedIn, adminLogin, adminLogout };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}