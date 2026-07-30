import { useEffect, useState } from "react";
import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useStaff } from "./StaffContext";

const DEFAULT_PERMISSIONS = {
  owner: [
    "manage_fleet",
    "dispatch",
    "clearance_review",
    "view_reports",
    "manage_staff",
  ],
  staff: ["manage_fleet", "view_reports"],
  dispatcher: ["dispatch"],
  checklist_admin: ["clearance_review"],
};

export function useStaffDirectory() {
  const { staffProfile } = useStaff();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "lykas_staff"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setStaffList(snapshot.docs.map((d) => ({ uid: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load staff directory:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  // Looks up user_lookup/{email} to resolve a uid, then creates the
  // lykas_staff doc. Throws if the person hasn't signed up as a customer yet.
  const addStaffByEmail = async (email, role, permissions) => {
    const normalizedEmail = email.trim().toLowerCase();
    const lookupSnap = await getDoc(doc(db, "user_lookup", normalizedEmail));

    if (!lookupSnap.exists()) {
      throw new Error(
        "This person hasn't signed up yet — ask them to create an account first."
      );
    }

    const { uid } = lookupSnap.data();
    const userSnap = await getDoc(doc(db, "users", uid));
    const userData = userSnap.exists() ? userSnap.data() : {};

    await setDoc(doc(db, "lykas_staff", uid), {
      uid,
      displayName: userData.displayName || null,
      email: normalizedEmail,
      role,
      permissions: permissions ?? DEFAULT_PERMISSIONS[role] ?? [],
      active: true,
      createdAt: serverTimestamp(),
      createdBy: staffProfile?.uid ?? null,
      updatedAt: serverTimestamp(),
    });
  };

  const updateStaff = async (uid, { role, permissions }) => {
    await updateDoc(doc(db, "lykas_staff", uid), {
      role,
      permissions: permissions ?? DEFAULT_PERMISSIONS[role] ?? [],
      updatedAt: serverTimestamp(),
    });
  };

  const toggleActive = async (uid, active) => {
    await updateDoc(doc(db, "lykas_staff", uid), {
      active,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteStaff = async (uid) => {
    await deleteDoc(doc(db, "lykas_staff", uid));
  };

  return {
    staffList,
    loading,
    addStaffByEmail,
    updateStaff,
    toggleActive,
    deleteStaff,
    DEFAULT_PERMISSIONS,
  };
}
