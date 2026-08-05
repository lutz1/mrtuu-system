// TODO: mock data — separate seeded dataset for now, since there's no
// inspection-checklist screen yet to actually produce real history
// records. Once that screen exists, completing a pickup/return
// inspection should append a real entry here instead.

export const INSPECTION_STATUSES = ["Cleared", "Sent to Admin", "Returned"];

const BASE_HISTORY = [
  { id: "BK-0001", customer: "Juan Dela Cruz", vehicle: "Toyota Vios", plate: "ABC 1234", pickupDate: "May 25, 2026", pickupTime: "10:00 AM", returnDate: "May 30, 2026", returnTime: "10:00 AM", inspectedOn: "May 30, 2026", inspectedTime: "10:00 AM", status: "Cleared" },
  { id: "BK-0002", customer: "Ram Boy", vehicle: "Honda City", plate: "FDS 4353", pickupDate: "May 25, 2026", pickupTime: "09:00 AM", returnDate: "May 29, 2026", returnTime: "09:00 AM", inspectedOn: "May 29, 2026", inspectedTime: "09:00 AM", status: "Cleared" },
  { id: "BK-0003", customer: "Tortskie Jerwen", vehicle: "Misyubibi Xpander", plate: "GDF 3455", pickupDate: "May 25, 2026", pickupTime: "02:00 PM", returnDate: "May 28, 2026", returnTime: "02:00 PM", inspectedOn: "May 28, 2026", inspectedTime: "02:00 PM", status: "Sent to Admin" },
  { id: "BK-0004", customer: "Leigh Carcallas", vehicle: "Toyota Raize", plate: "FGH 3456", pickupDate: "May 25, 2026", pickupTime: "08:00 AM", returnDate: "May 27, 2026", returnTime: "08:00 AM", inspectedOn: "May 27, 2026", inspectedTime: "08:00 AM", status: "Returned" },
  { id: "BK-0005", customer: "Maria Santos", vehicle: "Nissan Almera", plate: "QWE 3456", pickupDate: "May 25, 2026", pickupTime: "11:00 AM", returnDate: "May 26, 2026", returnTime: "11:00 AM", inspectedOn: "May 26, 2026", inspectedTime: "11:00 AM", status: "Cleared" },
  { id: "BK-0006", customer: "Vincent Fabron", vehicle: "Toyota Raize", plate: "FGH 3456", pickupDate: "May 25, 2026", pickupTime: "11:00 AM", returnDate: "May 26, 2026", returnTime: "11:00 AM", inspectedOn: "May 26, 2026", inspectedTime: "11:00 AM", status: "Cleared" },
  { id: "BK-0007", customer: "Hanni Pham", vehicle: "Honda City", plate: "FDS 4353", pickupDate: "May 25, 2026", pickupTime: "11:00 AM", returnDate: "May 26, 2026", returnTime: "11:00 AM", inspectedOn: "May 26, 2026", inspectedTime: "11:00 AM", status: "Returned" },
];

const EXTRA_NAMES = [
  "Carlo Reyes", "Bea Fernandez", "Nico Villanueva", "Angela Cruz", "Paolo Ramos",
  "Kristine Uy", "Miguel Santos", "Diana Torres", "Renz Aquino", "Cathy Lim",
  "Jomar Reyes", "Ella Navarro", "Sean Bautista", "Trisha Gomez", "Kevin Ong",
  "Nadia Flores", "Bryan Castillo", "Joy Mendoza", "Aldrin Perez", "Shiela Cortez",
  "Kim Delos Santos", "Rico Villar", "Anne Bautista", "Marco Reyes", "Julia Santos",
  "Erwin Cruz", "Faye Alonzo", "Dennis Ramos", "Grace Uy", "Victor Lim",
  "Rhea Torres", "Ivan Aquino", "Precious Cruz", "Alvin Santos", "Michelle Reyes",
  "Ronald Cruz", "Karla Mendoza", "Jasper Ong", "Angeline Flores", "Roy Castillo",
  "Cindy Gomez",
];

const EXTRA_VEHICLES = [
  { vehicle: "Toyota Innova", plate: "HTY 8821" },
  { vehicle: "Ford Ranger", plate: "JKL 4432" },
  { vehicle: "Hyundai Accent", plate: "MNB 9987" },
  { vehicle: "Mitsubishi Mirage", plate: "POI 1123" },
  { vehicle: "Toyota Wigo", plate: "LKJ 6654" },
  { vehicle: "Honda BR-V", plate: "ZXC 3390" },
];

// Distributes the 41 generated rows so the final totals land on
// Cleared 32, Sent to Admin 12, Returned 4 (48 total), matching the
// reference exactly: base data already has Cleared 3, Sent to Admin 1,
// Returned 2, so extras need Cleared 29, Sent to Admin 11, Returned 2.
function statusForIndex(i) {
  if (i < 29) return "Cleared";
  if (i < 40) return "Sent to Admin";
  return "Returned";
}

const EXTRA_HISTORY = EXTRA_NAMES.map((name, i) => {
  const vehicle = EXTRA_VEHICLES[i % EXTRA_VEHICLES.length];
  const day = (i % 28) + 1;
  return {
    id: `BK-${String(8 + i).padStart(4, "0")}`,
    customer: name,
    vehicle: vehicle.vehicle,
    plate: vehicle.plate,
    pickupDate: `May ${day}, 2026`,
    pickupTime: "10:00 AM",
    returnDate: `May ${day}, 2026`,
    returnTime: "10:00 AM",
    inspectedOn: `May ${day}, 2026`,
    inspectedTime: "10:00 AM",
    status: statusForIndex(i),
  };
});

export const MOCK_INSPECTION_HISTORY = [...BASE_HISTORY, ...EXTRA_HISTORY];