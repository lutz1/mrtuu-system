import { createContext, useContext, useState } from "react";
import { MOCK_VEHICLES } from "../data/admin/mockVehicles";

// TODO: TEMPORARY. Holds vehicles in memory only — resets on page refresh.
// Replace with real Firestore reads/writes once the admin data layer
// exists; the addVehicle/updateVehicle shape here should carry over.
const AdminVehiclesContext = createContext(null);

function generateId(vehicles) {
  const maxNum = vehicles.reduce((max, v) => {
    const match = v.id.match(/V-(\d+)/);
    const num = match ? parseInt(match[1], 10) : 0;
    return Math.max(max, num);
  }, 0);
  return `V-${String(maxNum + 1).padStart(3, "0")}`;
}

export function AdminVehiclesProvider({ children }) {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);

  const addVehicle = (vehicleData) => {
    const newVehicle = { ...vehicleData, id: generateId(vehicles) };
    setVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  };

  const value = { vehicles, addVehicle };

  return <AdminVehiclesContext.Provider value={value}>{children}</AdminVehiclesContext.Provider>;
}

export function useAdminVehicles() {
  const context = useContext(AdminVehiclesContext);
  if (!context) {
    throw new Error("useAdminVehicles must be used within an AdminVehiclesProvider");
  }
  return context;
}