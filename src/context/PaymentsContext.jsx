import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useStaff } from "./StaffContext";

const PaymentsContext = createContext(null);

export function PaymentsProvider({ children }) {
  const { staffProfile, staffLoading } = useStaff();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (staffLoading) return;
    if (!staffProfile) {
      setPayments([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "lykas_payments"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPayments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load payments:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [staffProfile, staffLoading]);

  const value = useMemo(() => ({ payments, loading }), [payments, loading]);

  return (
    <PaymentsContext.Provider value={value}>
      {children}
    </PaymentsContext.Provider>
  );
}

export function usePayments() {
  const context = useContext(PaymentsContext);
  if (!context) {
    throw new Error("usePayments must be used within a PaymentsProvider");
  }
  return context;
}
