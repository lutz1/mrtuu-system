import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "lykas_isLoggedIn";

export function AuthProvider({ children }) {
  // Read initial state from localStorage so a refresh keeps the user logged in
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  // Hardcoded/fake login — accepts any email/password for now.
  // Swap this for a real API call once the backend exists; nothing
  // else in the app needs to change since everything just reads
  // isLoggedIn from this context.
  const login = (_email, _password) => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}