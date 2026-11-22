import { useEffect, useMemo, useState } from "react";
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

export const DEFAULT_PERMISSIONS = {
  owner: [
    "manage_fleet",
    "dispatch",
    "clearance_review",
    "view_reports",
    "manage_staff",
  ],
  staff: ["manage_fleet", "view_reports", "clearance_review"],
  dispatcher: ["dispatch"],
  checklist_admin: ["clearance_review"],
};

// Module-scope — none of these read component/hook state.
async function updateStaff(uid, { role, permissions }) {
  await updateDoc(doc(db, "lykas_staff", uid), {
    role,
    permissions: Array.isArray(permissions)
      ? permissions
      : DEFAULT_PERMISSIONS[role] ?? [],
    updatedAt: serverTimestamp(),
  });
}

async function toggleActive(uid, active) {
  await updateDoc(doc(db, "lykas_staff", uid), {
    active,
    updatedAt: serverTimestamp(),
  });
}

async function deleteStaff(uid) {
  await deleteDoc(doc(db, "lykas_staff", uid));
}

export function useStaffDirectory() {
  const { staffProfile } = useStaff();
  const [rawStaff, setRawStaff] = useState([]);
  const [profiles, setProfiles] = useState({}); // uid -> users/{uid} data (or null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "lykas_staff"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setRawStaff(snapshot.docs.map((d) => ({ uid: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load staff directory:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  // lykas_staff doesn't store login info. Read it once per staff member from
  // the shared users/{uid} doc (readable by any signed-in user per rules).
  useEffect(() => {
    const missing = rawStaff.filter((s) => profiles[s.uid] === undefined);
    if (missing.length === 0) return;

    let cancelled = false;
    Promise.all(
      missing.map((s) =>
        getDoc(doc(db, "users", s.uid))
          .then((snap) => [s.uid, snap.exists() ? snap.data() : null])
          .catch(() => [s.uid, null])
      )
    ).then((entries) => {
      if (!cancelled)
        setProfiles((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    });
    return () => {
      cancelled = true;
    };
  }, [rawStaff, profiles]);

  // Adds username (= the name entered at signup), last login, phone, photo
  // and the creator's name (instead of their raw uid) to each staff record.
  const staffList = useMemo(() => {
    const nameByUid = new Map(rawStaff.map((s) => [s.uid, s.displayName]));
    return rawStaff.map((s) => {
      const p = profiles[s.uid] || {};
      return {
        ...s,
        username: p.displayName || s.displayName || null,
        lastLogin: p.lastLoginAt || null,
        phone: p.contactPhone || p.phoneNumber || null,
        photoURL: p.photoURL || null,
        createdByName: nameByUid.get(s.createdBy) || null,
      };
    });
  }, [rawStaff, profiles]);

  // Stays in the hook — needs staffProfile.uid for createdBy.
  // `permissions`, if passed, must already be an array of permission
  // strings (e.g. ["manage_fleet", "view_reports"]). Anything else
  // (undefined, an object, a string) falls back to the role default.
  // Only fields that belong on the lykas_staff schema are ever written
  // here — no incidental form fields like phone/username/password.
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

    const resolvedPermissions = Array.isArray(permissions)
      ? permissions
      : DEFAULT_PERMISSIONS[role] ?? [];

    await setDoc(doc(db, "lykas_staff", uid), {
      uid,
      displayName: userData.displayName || null,
      email: normalizedEmail,
      role,
      permissions: resolvedPermissions,
      active: true,
      createdAt: serverTimestamp(),
      createdBy: staffProfile?.uid ?? null,
      updatedAt: serverTimestamp(),
    });
  };

  return useMemo(
    () => ({
      staffList,
      loading,
      addStaffByEmail,
      updateStaff,
      toggleActive,
      deleteStaff,
      DEFAULT_PERMISSIONS,
    }),
    [staffList, loading, staffProfile, addStaffByEmail]
  );
}
