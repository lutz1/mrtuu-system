import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

const StaffContext = createContext(null);

export function StaffProvider({ children }) {
  const { user, authLoading } = useAuth();
  const [staffProfile, setStaffProfile] = useState(null);
  const [staffLoading, setStaffLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    setStaffLoading(true);
    if (!user) {
      queueMicrotask(() => {
        setStaffProfile(null);
        setStaffLoading(false);
      });
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "lykas_staff", user.uid),
      (snap) => {
        if (snap.exists() && snap.data().active === true) {
          setStaffProfile({ uid: user.uid, ...snap.data() });
        } else {
          setStaffProfile(null);
        }
        setStaffLoading(false);
      },
      (err) => {
        console.error("Failed to subscribe to staff profile:", err);
        queueMicrotask(() => {
          setStaffProfile(null);
          setStaffLoading(false);
        });
      }
    );
    return unsubscribe;
  }, [user, authLoading]);

  const value = useMemo(() => {
    const hasPermission = (permission) =>
      !!staffProfile?.permissions?.includes(permission);
    return { staffProfile, staffLoading, hasPermission };
  }, [staffProfile, staffLoading]);

  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
}
