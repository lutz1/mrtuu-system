import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";

const ThemeContext = createContext(null);

const STORAGE_KEY = "lyka-theme";

function getInitialTheme() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  // Fixed default — do NOT follow the OS / PC dark-mode preference.
  return "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply the theme to <html>, but do NOT persist it here. Persisting is the
  // job of manual actions (toggleTheme) and ThemeGate on login — this keeps
  // the forced "logged-out = light" state from overwriting the user's saved
  // preference in localStorage.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Manual toggle: persists the user's explicit choice.
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  };

  const value = { theme, setTheme, toggleTheme, isDark: theme === "dark" };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Enforces the theme rule:
//  - NOT logged in  -> always light (forced, NOT persisted to localStorage)
//  - logged in      -> restore the user's saved preference (so a dark-mode
//                      user who logged out doesn't get stuck on light)
export function ThemeGate() {
  const { isLoggedIn } = useAuth();
  const { setTheme } = useTheme();
  const location = useLocation();

  const { pathname } = location;

  // Auth pages (login/signup) own their own forced-light state and must not
  // be overridden by the branches below — they set data-theme directly.
  const onAuthRoute = pathname === "/login" || pathname === "/signup";

  // Admin & dispatcher UIs are always the original light theme, never themed.
  const onAdminOrDispatcher =
    pathname.startsWith("/admin") || pathname.startsWith("/dispatcher");

  useEffect(() => {
    if (onAuthRoute) return; // let the auth page force light itself
    if (onAdminOrDispatcher) {
      setTheme("light"); // always light; do not persist
      return;
    }
    if (!isLoggedIn) {
      setTheme("light"); // in-memory only; saved preference is preserved
    } else {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
    }
  }, [isLoggedIn, setTheme, onAuthRoute, onAdminOrDispatcher]);

  return null;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
