const STORAGE_KEY = "lyka-auth-redirect";

export function setAuthRedirect(path, state) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ path, state: state ?? null })
    );
  } catch {
    // sessionStorage unavailable — redirect just falls back to "/"
  }
}

export function getAuthRedirect() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuthRedirect() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
