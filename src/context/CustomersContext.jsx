import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useStaff } from "./StaffContext";

const CustomersContext = createContext(null);

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatJoined(value) {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// `d` is a lykas_customers doc ({ id, ...data }); `profile` is the matching
// users/{uid} doc, used only to fill gaps on older records that were saved
// before email/phone were stored on lykas_customers.
function toCustomer(d, profile) {
  const p = profile || {};
  return {
    id: d.id,
    uid: d.id,
    name:
      [d.firstName, d.lastName].filter(Boolean).join(" ") ||
      p.displayName ||
      "—",
    email: d.email || p.email || "—",
    phone: d.phone || p.phoneNumber || p.contactPhone || "—",
    license: d.driverLicenseNo || "—",
    joinedDate: formatJoined(d.createdAt),
    joinedAt: d.createdAt,
    status: d.licenseVerified ? "Verified" : "Unverified",
  };
}

export function CustomersProvider({ children }) {
  const { staffProfile, staffLoading } = useStaff();
  const [rawCustomers, setRawCustomers] = useState([]);
  const [profiles, setProfiles] = useState({}); // uid -> users/{uid} data (or null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // lykas_customers reads are staff-gated in firestore.rules. This provider
    // is mounted for /admin/* and /dispatcher/* only, but still wait until we
    // know the signed-in user is active staff before subscribing.
    if (staffLoading) return;
    if (!staffProfile) {
      setRawCustomers([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "lykas_customers"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setRawCustomers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load customers:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [staffProfile, staffLoading]);

  // For customers missing email or phone, look up their users/{uid} profile once.
  useEffect(() => {
    const missing = rawCustomers.filter(
      (c) => (!c.email || !c.phone) && profiles[c.id] === undefined
    );
    if (missing.length === 0) return;

    let cancelled = false;
    Promise.all(
      missing.map((c) =>
        getDoc(doc(db, "users", c.id))
          .then((snap) => [c.id, snap.exists() ? snap.data() : null])
          .catch(() => [c.id, null])
      )
    ).then((entries) => {
      if (!cancelled)
        setProfiles((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    });
    return () => {
      cancelled = true;
    };
  }, [rawCustomers, profiles]);

  const customers = useMemo(
    () => rawCustomers.map((c) => toCustomer(c, profiles[c.id])),
    [rawCustomers, profiles]
  );

  const toggleVerification = useCallback(
    async (uid) => {
      const current = customers.find((c) => c.uid === uid);
      if (!current) return;
      await updateDoc(doc(db, "lykas_customers", uid), {
        licenseVerified: current.status !== "Verified",
      });
    },
    [customers]
  );

  const value = useMemo(
    () => ({ customers, loading, toggleVerification }),
    [customers, loading, toggleVerification]
  );

  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error("useCustomers must be used within a CustomersProvider");
  }
  return context;
}
