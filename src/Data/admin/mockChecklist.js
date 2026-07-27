// --- Extra generated entries so every tab has enough items to actually
// demonstrate pagination, not just "Pending Documents" (which is all the
// original 6-entry reference sample covered). TODO: remove once real
// checklist data exists.

const EXTRA_NAMES = [
  "Carlo Reyes", "Bea Fernandez", "Nico Villanueva", "Angela Cruz",
  "Paolo Ramos", "Kristine Uy", "Miguel Santos", "Diana Torres",
  "Renz Aquino", "Cathy Lim", "Jomar Reyes", "Ella Navarro",
  "Sean Bautista", "Trisha Gomez", "Kevin Ong", "Nadia Flores",
  "Bryan Castillo", "Joy Mendoza", "Aldrin Perez", "Shiela Cortez",
];

const EXTRA_VEHICLES = [
  { vehicle: "Toyota Innova", plate: "HTY 8821" },
  { vehicle: "Ford Ranger", plate: "JKL 4432" },
  { vehicle: "Hyundai Accent", plate: "MNB 9987" },
  { vehicle: "Mitsubishi Mirage", plate: "POI 1123" },
  { vehicle: "Toyota Wigo", plate: "LKJ 6654" },
  { vehicle: "Honda BR-V", plate: "ZXC 3390" },
];

const STATUS_CYCLE = ["Pending Documents", "For Dispatcher", "Cleared / Completed", "Rejected"];

function generateDocuments(seed) {
  const uploadedCount = 1 + (seed % 4);
  return [
    { key: "license", label: "Driver's License", description: "Valid driver's license", status: uploadedCount >= 1 ? "Uploaded" : "Not Uploaded" },
    { key: "validId", label: "Valid ID", description: "Government-issued ID", status: uploadedCount >= 2 ? "Uploaded" : "Not Uploaded" },
    { key: "proofOfPayment", label: "Proof of Payment", description: "Proof of full or partial payment", status: uploadedCount >= 3 ? "Uploaded" : "Not Uploaded" },
    { key: "rentalAgreement", label: "Rental Agreement", description: "Signed rental agreement", status: uploadedCount >= 4 ? "Uploaded" : "Not Uploaded" },
  ];
}

const EXTRA_CHECKLIST_ENTRIES = EXTRA_NAMES.map((name, i) => {
  const vehicle = EXTRA_VEHICLES[i % EXTRA_VEHICLES.length];
  return {
    id: `#BK-${1030 + i}`,
    customer: name,
    phone: `09${String(10 + i).padStart(2, "0")} ${String(100 + i * 7).padStart(3, "0")} ${String(1000 + i * 13).padStart(4, "0")}`,
    email: `${name.split(" ")[0].toLowerCase()}${i}@gmail.com`,
    vehicle: vehicle.vehicle,
    plate: vehicle.plate,
    transmission: i % 3 === 0 ? "Manual" : "Automatic",
    seats: i % 5 === 0 ? 7 : 5,
    rentalDate: `May ${(i % 28) + 1}, 2026`,
    rentalTime: "10:00 AM",
    returnDate: `May ${((i + 2) % 28) + 1}, 2026`,
    returnTime: "10:00 AM",
    amount: 3000 + i * 150,
    paymentMethod: i % 2 === 0 ? "Online Payment" : "Cash on Pickup",
    checklistStatus: STATUS_CYCLE[i % STATUS_CYCLE.length],
    remarks: "",
    documents: generateDocuments(i),
  };
});

export const ALL_CHECKLIST_ENTRIES = [...INITIAL_CHECKLIST_ENTRIES, ...EXTRA_CHECKLIST_ENTRIES];