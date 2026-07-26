// TODO: mock data — replace with real bookings from Firestore/backend
// once the admin data layer exists.

const STATUSES = ["Pending Documents", "For Dispatcher", "Ready for Pickup", "Completed", "Cancelled"];

const BASE_BOOKINGS = [
  {
    id: "#BK-1024",
    customer: "Juan Dela Cruz",
    phone: "0967 676 7676",
    vehicle: "Toyota Vios",
    plate: "ABC 1234",
    rentalDate: "May 28, 2026",
    rentalTime: "10:00 AM",
    returnDate: "May 30, 2026",
    returnTime: "10:00 AM",
    amount: 3600,
    status: "Pending Documents",
  },
  {
    id: "#BK-1025",
    customer: "Ram Boy",
    phone: "0945 969 3524",
    vehicle: "Honda City",
    plate: "FDS 4353",
    rentalDate: "May 27, 2026",
    rentalTime: "09:00 AM",
    returnDate: "May 29, 2026",
    returnTime: "09:00 AM",
    amount: 4000,
    status: "For Dispatcher",
  },
  {
    id: "#BK-1026",
    customer: "Tortskie Jerwen",
    phone: "0912 456 7456",
    vehicle: "Misyubibi Xpander",
    plate: "GDF 3455",
    rentalDate: "May 26, 2026",
    rentalTime: "02:00 PM",
    returnDate: "May 28, 2026",
    returnTime: "02:00 PM",
    amount: 5500,
    status: "Ready for Pickup",
  },
  {
    id: "#BK-1027",
    customer: "Leigh Carcallas",
    phone: "0934 654 5632",
    vehicle: "Toyota Raize",
    plate: "FGH 3456",
    rentalDate: "May 25, 2026",
    rentalTime: "08:00 AM",
    returnDate: "May 27, 2026",
    returnTime: "08:00 AM",
    amount: 3200,
    status: "Completed",
  },
  {
    id: "#BK-1028",
    customer: "Maria Santos",
    phone: "0934 654 5632",
    vehicle: "Nissan Almera",
    plate: "QWE 3456",
    rentalDate: "May 24, 2026",
    rentalTime: "11:00 AM",
    returnDate: "May 26, 2026",
    returnTime: "11:00 AM",
    amount: 3800,
    status: "Cancelled",
  },
  {
    id: "#BK-1029",
    customer: "Vincent Fabron",
    phone: "0956 879 3456",
    vehicle: "Suzuki Swift",
    plate: "GRS 5675",
    rentalDate: "May 28, 2026",
    rentalTime: "01:00 PM",
    returnDate: "May 31, 2026",
    returnTime: "01:00 PM",
    amount: 4200,
    status: "Pending Documents",
  },
];

const EXTRA_NAMES = [
  "Carlo Reyes", "Bea Fernandez", "Nico Villanueva", "Angela Cruz",
  "Paolo Ramos", "Kristine Uy", "Miguel Santos", "Diana Torres",
  "Renz Aquino", "Cathy Lim", "Jomar Reyes", "Ella Navarro",
  "Sean Bautista", "Trisha Gomez", "Kevin Ong", "Nadia Flores",
  "Bryan Castillo", "Joy Mendoza",
];

const EXTRA_VEHICLES = [
  { vehicle: "Toyota Innova", plate: "HTY 8821" },
  { vehicle: "Ford Ranger", plate: "JKL 4432" },
  { vehicle: "Hyundai Accent", plate: "MNB 9987" },
  { vehicle: "Mitsubishi Mirage", plate: "POI 1123" },
  { vehicle: "Toyota Wigo", plate: "LKJ 6654" },
  { vehicle: "Honda BR-V", plate: "ZXC 3390" },
];

const EXTRA_BOOKINGS = EXTRA_NAMES.map((name, i) => {
  const vehicle = EXTRA_VEHICLES[i % EXTRA_VEHICLES.length];
  return {
    id: `#BK-${1030 + i}`,
    customer: name,
    phone: `09${String(10 + i).padStart(2, "0")} ${String(100 + i * 7).padStart(3, "0")} ${String(1000 + i * 13).padStart(4, "0")}`,
    vehicle: vehicle.vehicle,
    plate: vehicle.plate,
    rentalDate: `May ${(i % 28) + 1}, 2026`,
    rentalTime: "10:00 AM",
    returnDate: `May ${((i + 2) % 28) + 1}, 2026`,
    returnTime: "10:00 AM",
    amount: 3000 + i * 150,
    status: STATUSES[i % STATUSES.length],
  };
});

export const MOCK_BOOKINGS = [...BASE_BOOKINGS, ...EXTRA_BOOKINGS];