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
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

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

function toCustomer(docSnap) {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    uid: docSnap.id,
    name:
      d.firstName && d.lastName
        ? `${d.firstName} ${d.lastName}`
        : d.displayName || "—",
    email: d.email || "—",
    phone: d.phone || "—",
    license: d.driverLicenseNo || "—",
    joinedDate: formatJoined(d.createdAt),
    joinedAt: d.createdAt,
    status: d.licenseVerified ? "Verified" : "Unverified",
  };
}

export function CustomersProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "lykas_customers"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setCustomers(snapshot.docs.map(toCustomer));
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load customers:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

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
