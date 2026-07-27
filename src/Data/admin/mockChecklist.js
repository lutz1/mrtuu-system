// TODO: mock data — replace with real checklist entries (linked to real
// bookings and uploaded documents) once the admin data layer exists.
//
// NOTE: the reference design showed a mismatch where the booking list
// and the detail panel displayed two different customer names for the
// same booking ID (#BK-1024). That's very likely a reference/mockup
// inconsistency rather than intentional — replicating it here would
// make row selection look broken (clicking a row would show someone
// else's info), so this data uses one consistent name per booking.

export const INITIAL_CHECKLIST_ENTRIES = [
  {
    id: "#BK-1024",
    customer: "Juan Dela Cruz",
    phone: "0967 676 7676",
    email: "sesite67@gmail.com",
    vehicle: "Toyota Vios",
    plate: "ABC 1234",
    transmission: "Automatic",
    seats: 5,
    rentalDate: "May 28, 2026",
    rentalTime: "10:00 AM",
    returnDate: "May 30, 2026",
    returnTime: "10:00 AM",
    amount: 3600,
    paymentMethod: "Online Payment",
    checklistStatus: "Pending Documents",
    remarks: "",
    documents: [
      { key: "license", label: "Driver's License", description: "Valid driver's license", status: "Uploaded" },
      { key: "validId", label: "Valid ID", description: "Government-issued ID", status: "Uploaded" },
      // NOTE: description repeated from Driver's License in the reference
      // design — likely a copy-paste typo there, replicated as-is.
      { key: "proofOfPayment", label: "Proof of Payment", description: "Valid driver's license", status: "Uploaded" },
      { key: "rentalAgreement", label: "Rental Agreement", description: "Signed rental agreement", status: "Not Uploaded" },
    ],
  },
  {
    id: "#BK-1025",
    customer: "Ram Boy",
    phone: "0945 969 3524",
    email: "ramboy45@gmail.com",
    vehicle: "Honda City",
    plate: "FDS 4353",
    transmission: "Automatic",
    seats: 5,
    rentalDate: "May 27, 2026",
    rentalTime: "09:00 AM",
    returnDate: "May 29, 2026",
    returnTime: "09:00 AM",
    amount: 4000,
    paymentMethod: "Cash on Pickup",
    checklistStatus: "Pending Documents",
    remarks: "",
    documents: [
      { key: "license", label: "Driver's License", description: "Valid driver's license", status: "Uploaded" },
      { key: "validId", label: "Valid ID", description: "Government-issued ID", status: "Not Uploaded" },
      { key: "proofOfPayment", label: "Proof of Payment", description: "Proof of full or partial payment", status: "Not Uploaded" },
      { key: "rentalAgreement", label: "Rental Agreement", description: "Signed rental agreement", status: "Not Uploaded" },
    ],
  },
  {
    id: "#BK-1026",
    customer: "Tortskie Jerwen",
    phone: "0912 456 7456",
    email: "tortskiej@gmail.com",
    vehicle: "Misyubibi Xpander",
    plate: "GDF 3455",
    transmission: "Manual",
    seats: 7,
    rentalDate: "May 26, 2026",
    rentalTime: "02:00 PM",
    returnDate: "May 28, 2026",
    returnTime: "02:00 PM",
    amount: 5500,
    paymentMethod: "Online Payment",
    checklistStatus: "Pending Documents",
    remarks: "",
    documents: [
      { key: "license", label: "Driver's License", description: "Valid driver's license", status: "Uploaded" },
      { key: "validId", label: "Valid ID", description: "Government-issued ID", status: "Uploaded" },
      { key: "proofOfPayment", label: "Proof of Payment", description: "Proof of full or partial payment", status: "Uploaded" },
      { key: "rentalAgreement", label: "Rental Agreement", description: "Signed rental agreement", status: "Uploaded" },
    ],
  },
  {
    id: "#BK-1027",
    customer: "Leigh Carcallas",
    phone: "0934 654 5632",
    email: "leighc@gmail.com",
    vehicle: "Toyota Raize",
    plate: "FGH 3456",
    transmission: "Automatic",
    seats: 5,
    rentalDate: "May 25, 2026",
    rentalTime: "08:00 AM",
    returnDate: "May 27, 2026",
    returnTime: "08:00 AM",
    amount: 3200,
    paymentMethod: "Online Payment",
    checklistStatus: "Pending Documents",
    remarks: "",
    documents: [
      { key: "license", label: "Driver's License", description: "Valid driver's license", status: "Uploaded" },
      { key: "validId", label: "Valid ID", description: "Government-issued ID", status: "Uploaded" },
      { key: "proofOfPayment", label: "Proof of Payment", description: "Proof of full or partial payment", status: "Not Uploaded" },
      { key: "rentalAgreement", label: "Rental Agreement", description: "Signed rental agreement", status: "Uploaded" },
    ],
  },
  {
    id: "#BK-1028",
    customer: "Maria Santos",
    phone: "0934 654 5632",
    email: "mariasantos@gmail.com",
    vehicle: "Nissan Almera",
    plate: "QWE 3456",
    transmission: "Automatic",
    seats: 5,
    rentalDate: "May 24, 2026",
    rentalTime: "11:00 AM",
    returnDate: "May 26, 2026",
    returnTime: "11:00 AM",
    amount: 3800,
    paymentMethod: "Cash on Pickup",
    checklistStatus: "Pending Documents",
    remarks: "",
    documents: [
      { key: "license", label: "Driver's License", description: "Valid driver's license", status: "Not Uploaded" },
      { key: "validId", label: "Valid ID", description: "Government-issued ID", status: "Uploaded" },
      { key: "proofOfPayment", label: "Proof of Payment", description: "Proof of full or partial payment", status: "Not Uploaded" },
      { key: "rentalAgreement", label: "Rental Agreement", description: "Signed rental agreement", status: "Not Uploaded" },
    ],
  },
  {
    id: "#BK-1029",
    customer: "Vincent Fabron",
    phone: "0956 879 3456",
    email: "vincentf@gmail.com",
    vehicle: "Suzuki Swift",
    plate: "GRS 5675",
    transmission: "Automatic",
    seats: 5,
    rentalDate: "May 28, 2026",
    rentalTime: "01:00 PM",
    returnDate: "May 31, 2026",
    returnTime: "01:00 PM",
    amount: 4200,
    paymentMethod: "Online Payment",
    checklistStatus: "Pending Documents",
    remarks: "",
    documents: [
      { key: "license", label: "Driver's License", description: "Valid driver's license", status: "Uploaded" },
      { key: "validId", label: "Valid ID", description: "Government-issued ID", status: "Uploaded" },
      { key: "proofOfPayment", label: "Proof of Payment", description: "Proof of full or partial payment", status: "Uploaded" },
      { key: "rentalAgreement", label: "Rental Agreement", description: "Signed rental agreement", status: "Not Uploaded" },
    ],
  },
];

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