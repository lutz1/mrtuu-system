import { createContext, useContext, useState } from "react";
import { MOCK_VEHICLES } from "../data/admin/mockVehicles";

// TODO: TEMPORARY. Holds vehicles in memory only — resets on page refresh.
// Replace with real Firestore reads/writes once the admin data layer
// exists; the addVehicle/updateVehicle/archiveVehicle shape here should
// carry over.
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
  const [allVehicles, setAllVehicles] = useState(MOCK_VEHICLES);

  const addVehicle = (vehicleData) => {
    const newVehicle = { ...vehicleData, id: generateId(allVehicles) };
    setAllVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicle = (id, vehicleData) => {
    setAllVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...vehicleData } : v)));
  };

  // TODO: soft-delete only — there's no "view archived vehicles" screen
  // yet, so archived vehicles simply disappear from the active list.
  const archiveVehicle = (id) => {
    setAllVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, archived: true } : v)));
  };

  const getVehicleById = (id) => allVehicles.find((v) => v.id === id);

  // Consumers see only non-archived vehicles by default.
  const vehicles = allVehicles.filter((v) => !v.archived);

  const value = { vehicles, addVehicle, updateVehicle, archiveVehicle, getVehicleById };

  return <AdminVehiclesContext.Provider value={value}>{children}</AdminVehiclesContext.Provider>;
}

export function useAdminVehicles() {
  const context = useContext(AdminVehiclesContext);
  if (!context) {
    throw new Error("useAdminVehicles must be used within an AdminVehiclesProvider");
  }
  return context;
}