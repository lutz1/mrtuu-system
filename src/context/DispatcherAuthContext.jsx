import { createContext, useContext, useState } from "react";

const DispatcherAuthContext = createContext(null);

const STORAGE_KEY = "lyka-dispatcher-session";

// TODO: TEMPORARY. Same dummy-credential approach as AdminAuthContext —
// no real dispatcher auth/role system exists yet. Replace with a real
// check before this ships. Never treat these credentials as real
// security.
const DUMMY_DISPATCHER_CREDENTIALS = {
  email: "dispatcher@lyka.com",
  password: "dispatcher123",
};

function getInitialSession() {
  return window.sessionStorage.getItem(STORAGE_KEY) === "true";
}

export function DispatcherAuthProvider({ children }) {
  const [isDispatcherLoggedIn, setIsDispatcherLoggedIn] = useState(getInitialSession);

  const dispatcherLogin = (email, password) => {
    return new Promise((resolve, reject) => {
      const matches =
        email.trim().toLowerCase() === DUMMY_DISPATCHER_CREDENTIALS.email &&
        password === DUMMY_DISPATCHER_CREDENTIALS.password;

      if (matches) {
        window.sessionStorage.setItem(STORAGE_KEY, "true");
        setIsDispatcherLoggedIn(true);
        resolve();
      } else {
        reject(new Error("Invalid dispatcher email or password."));
      }
    });
  };

  const dispatcherLogout = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setIsDispatcherLoggedIn(false);
  };

  const value = { isDispatcherLoggedIn, dispatcherLogin, dispatcherLogout };

  return <DispatcherAuthContext.Provider value={value}>{children}</DispatcherAuthContext.Provider>;
}

export function useDispatcherAuth() {
  const context = useContext(DispatcherAuthContext);
  if (!context) {
    throw new Error("useDispatcherAuth must be used within a DispatcherAuthProvider");
  }
  return context;
}