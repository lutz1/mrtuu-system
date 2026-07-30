import { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

const VEHICLES_COLLECTION = "lykas_vehicles";

const VehiclesContext = createContext(null);

export function VehiclesProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, VEHICLES_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setVehicles(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load vehicles:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const getVehicleById = (id) =>
    vehicles.find((v) => String(v.id) === String(id));

  return (
    <VehiclesContext.Provider value={{ vehicles, loading, getVehicleById }}>
      {children}
    </VehiclesContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error("useVehicles must be used within a VehiclesProvider");
  }
  return context;
}
