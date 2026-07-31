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
