import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
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
        // Customer-facing context: never expose draft or archived vehicles.
        // Drafts can have incomplete data (missing price, features, images)
        // and were never meant to be bookable, so filtering here — not
        // just in AdminVehiclesContext — keeps every customer page
        // (Showroom, Landing, VehicleOverview) safe from that data by
        // construction instead of relying on each page to filter itself.
        // Single pass: map + filter combined via reduce, instead of two
        // separate array traversals.
        const docs = snapshot.docs.reduce((acc, d) => {
          const vehicle = { id: d.id, ...d.data() };
          if (!vehicle.draft && !vehicle.archived) acc.push(vehicle);
          return acc;
        }, []);

        setVehicles(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load vehicles:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const getVehicleById = useCallback(
    (id) => vehicles.find((v) => String(v.id) === String(id)),
    [vehicles]
  );

  const value = useMemo(
    () => ({ vehicles, loading, getVehicleById }),
    [vehicles, loading, getVehicleById]
  );

  return (
    <VehiclesContext.Provider value={value}>
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
