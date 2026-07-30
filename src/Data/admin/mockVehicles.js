// TODO: mock data — replace with real vehicle records (and real photos)
// once the admin data layer exists.
//
// NOTE: the reference design labeled every vehicle's type as "SUV"
// regardless of actual body style (including the Swift and Vios/Corolla,
// which aren't SUVs). Since this page has a real "All Types" filter,
// replicating that would make the filter non-functional — types below
// are corrected to match each vehicle's real body style instead.

export const VEHICLE_STATUSES = ["Available", "On Rent", "Under Maintenance", "Unavailable"];
export const VEHICLE_TYPES = ["Sedan", "SUV", "Hatchback", "MPV", "Pickup", "Van"];
export const VEHICLE_BRANDS = ["Toyota", "Honda", "Suzuki", "Ford", "Mitsubishi", "Nissan", "Hyundai"];
export const FUEL_TYPES = ["Gasoline", "Diesel", "Electric", "Hybrid"];
export const SEAT_OPTIONS = [2, 4, 5, 7, 8, 12, 15];
export const PREDEFINED_FEATURES = [
  "Bluetooth",
  "Air conditioning",
  "GPS navigation",
  "Sunroof",
  "Reverse Camera",
  "Apple CarPlay",
  "ABS",
];

const BASE_VEHICLES = [
  { id: "V-001", name: "Toyota Fortuner", plate: "ABC 1234", transmission: "Automatic", seats: 5, type: "SUV", price: 1800, status: "Available" },
  { id: "V-002", name: "Suzuki Swift", plate: "FGH 453", transmission: "Automatic", seats: 5, type: "Hatchback", price: 1800, status: "On Rent" },
  { id: "V-003", name: "Toyota Corolla", plate: "JGD 456", transmission: "Automatic", seats: 5, type: "Sedan", price: 1800, status: "Available" },
  { id: "V-004", name: "Ford Everest", plate: "SJF 756", transmission: "Automatic", seats: 5, type: "SUV", price: 1800, status: "Available" },
  { id: "V-005", name: "Honda Civic", plate: "TFV 462", transmission: "Automatic", seats: 5, type: "Sedan", price: 1800, status: "On Rent" },
  { id: "V-006", name: "Toyota Vios", plate: "OPU 859", transmission: "Automatic", seats: 5, type: "Sedan", price: 1800, status: "Available" },
  { id: "V-007", name: "Mitsubishi Xpander", plate: "RTF 462", transmission: "Automatic", seats: 5, type: "MPV", price: 1800, status: "Under Maintenance" },
  { id: "V-008", name: "Toyota Fortuner", plate: "OIR 756", transmission: "Automatic", seats: 5, type: "SUV", price: 1800, status: "Available" },
];

const EXTRA_POOL = [
  { name: "Toyota Wigo", type: "Hatchback", seats: 5 },
  { name: "Hyundai Accent", type: "Sedan", seats: 5 },
  { name: "Ford Ranger", type: "Pickup", seats: 5 },
  { name: "Toyota Innova", type: "MPV", seats: 7 },
  { name: "Honda BR-V", type: "SUV", seats: 7 },
  { name: "Mitsubishi Mirage", type: "Hatchback", seats: 5 },
  { name: "Nissan Almera", type: "Sedan", seats: 5 },
  { name: "Toyota Hiace", type: "Van", seats: 12 },
];

const STATUS_CYCLE = ["Available", "Available", "Available", "On Rent", "Under Maintenance"];

const EXTRA_VEHICLES = Array.from({ length: 40 }, (_, i) => {
  const pool = EXTRA_POOL[i % EXTRA_POOL.length];
  return {
    id: `V-${String(9 + i).padStart(3, "0")}`,
    name: pool.name,
    plate: `${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(66 + ((i + 3) % 24))}${String.fromCharCode(
      67 + ((i + 5) % 22)
    )} ${1000 + i * 7}`,
    transmission: i % 4 === 0 ? "Manual" : "Automatic",
    seats: pool.seats,
    type: pool.type,
    price: 1500 + (i % 6) * 200,
    status: STATUS_CYCLE[i % STATUS_CYCLE.length],
  };
});

export const MOCK_VEHICLES = [...BASE_VEHICLES, ...EXTRA_VEHICLES];