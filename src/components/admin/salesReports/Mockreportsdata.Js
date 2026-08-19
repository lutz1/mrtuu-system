// mockReportsData.js
// Temporary static/mock data so the Sales, Bookings, and Vehicle report tabs
// can be built and tested before the real endpoints are wired up.
// Swap these out for API-driven hooks (similar to useSalesReportsData) later.

const VEHICLES = [
  { name: "Toyota Vios", plate: "ABC 1234", type: "Sedan" },
  { name: "Honda City", plate: "FDS 4353", type: "Sedan" },
  { name: "Mitsubishi Xpander", plate: "GDF 3455", type: "MPV" },
  { name: "Toyota Raize", plate: "FGH 3456", type: "SUV" },
  { name: "Nissan Almera", plate: "QWE 3456", type: "Sedan" },
  { name: "Mitsubishi Montero", plate: "ABC 754", type: "SUV" },
  { name: "Toyota Fortuner", plate: "TRX 981", type: "SUV" },
  { name: "Honda CR-V", plate: "HCR 220", type: "SUV" },
  { name: "Toyota Innova", plate: "INV 118", type: "MPV" },
  { name: "Ford Ranger", plate: "FRD 552", type: "Pickup" },
  { name: "Hyundai Accent", plate: "HYA 309", type: "Sedan" },
  { name: "Suzuki Ertiga", plate: "SZE 671", type: "MPV" },
];

const CUSTOMERS = [
  "Juan Dela Cruz",
  "Ram Boy",
  "Tortskie Jerwen",
  "Leigh Carcallas",
  "Maria Santos",
  "Angelica Reyes",
  "Mark Villanueva",
  "Kristine Uy",
  "Paolo Mendoza",
  "Bea Fernandez",
  "Jerome Aquino",
  "Nicole Salazar",
];

const BOOKING_STATUSES = ["Active", "Completed", "Completed", "Cancelled"];

function pad(num) {
  return String(num).padStart(4, "0");
}

function buildDate(offsetDays) {
  const base = new Date(2026, 4, 30); // May 30, 2026
  const d = new Date(base);
  d.setDate(base.getDate() - offsetDays);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const SALES_REPORT_ROWS = Array.from({ length: 18 }, (_, i) => {
  const vehicle = VEHICLES[i % VEHICLES.length];
  const rentalAmount = 3200;
  const otherCharges = i % 3 === 0 ? 300 : 150;
  return {
    id: `BK-${1024 + i}`,
    date: buildDate(i),
    bookingId: `#BK-${1024 + i}`,
    customer: CUSTOMERS[i % CUSTOMERS.length],
    vehicleName: vehicle.name,
    vehiclePlate: vehicle.plate,
    rentalAmount,
    otherCharges,
    totalAmount: rentalAmount + otherCharges,
  };
});

export const SALES_REPORT_STATS = [
  { key: "totalRevenue", label: "Total Revenue", value: "₱98,450", change: "12.5%", direction: "up" },
  { key: "rentalAmount", label: "Rental Amount", value: "₱85,200", change: "8.2%", direction: "up" },
  { key: "otherCharges", label: "Other Charges", value: "₱13,250", change: "5.6%", direction: "up" },
  { key: "totalBookings", label: "Total Bookings", value: "42", change: "20.0%", direction: "up" },
];

export const BOOKINGS_REPORT_ROWS = Array.from({ length: 18 }, (_, i) => {
  const vehicle = VEHICLES[(i + 2) % VEHICLES.length];
  return {
    id: `BK-${1024 + i}`,
    date: buildDate(i),
    bookingId: `#BK-${1024 + i}`,
    customer: CUSTOMERS[(i + 3) % CUSTOMERS.length],
    vehicleName: vehicle.name,
    vehiclePlate: vehicle.plate,
    rentTime: "6h = 1:00 PM - 7:00 PM",
    totalAmount: 3500,
    status: BOOKING_STATUSES[i % BOOKING_STATUSES.length],
  };
});

export const BOOKINGS_REPORT_STATS = [
  { key: "totalBookings", label: "Total Bookings", value: "42", change: "20.0%", direction: "up" },
  { key: "activeRentals", label: "Active Rentals", value: "18", change: "12.5%", direction: "up" },
  { key: "completedRentals", label: "Completed Rentals", value: "24", change: "8.2%", direction: "up" },
  { key: "cancelledBookings", label: "Cancelled Bookings", value: "2", change: "5.6%", direction: "down" },
];

const VEHICLE_STATUSES = ["Rented", "Available", "Available", "Rented", "Maintenance"];

export const VEHICLE_REPORT_ROWS = Array.from({ length: 18 }, (_, i) => {
  const vehicle = VEHICLES[i % VEHICLES.length];
  return {
    id: `VEH-${100 + i}`,
    name: vehicle.name,
    subtitle: `${5 + (i % 3) * 2} Seater • ${vehicle.type}`,
    plate: vehicle.plate,
    type: vehicle.type,
    transmission: i % 4 === 0 ? "Manual" : "Automatic",
    status: VEHICLE_STATUSES[i % VEHICLE_STATUSES.length],
    totalBookings: 18 - i,
    lastRented: buildDate(i),
    totalRevenue: "₱3,500.00",
  };
});

export const VEHICLE_REPORT_STATS = [
  { key: "totalVehicles", label: "Total Vehicles", value: "23", helper: "Total Vehicles in system" },
  { key: "availableVehicles", label: "Available Vehicles", value: "12", helper: "Ready for rent" },
  { key: "rentedVehicles", label: "Rented Vehicles", value: "9", helper: "Currently rented" },
  { key: "maintenanceVehicles", label: "Maintenance", value: "2", helper: "Under maintenance" },
];

export const VEHICLE_STATUS_BREAKDOWN = [
  { label: "Available", value: 12, color: "#6C8CF5" },
  { label: "Rented", value: 9, color: "#33C481" },
  { label: "Maintenance", value: 2, color: "#F2A93B" },
];

export const TOP_VEHICLES_BY_REVENUE = [
  { name: "Toyota Vios", revenue: "₱45,500" },
  { name: "Mitsubishi Montero", revenue: "₱41,200" },
  { name: "Honda City", revenue: "₱38,900" },
  { name: "Toyota Raize", revenue: "₱35,100" },
  { name: "Nissan Almera", revenue: "₱30,600" },
];

export const VEHICLE_TOTAL_REVENUE = "₱191,300";

export const PAGE_SIZE = 5;

// ---------------------------------------------------------------------------
// Customer Report
// ---------------------------------------------------------------------------

const CUSTOMER_TYPES = ["Regular", "Regular", "Regular", "Regular", "New"];

export const CUSTOMER_REPORT_ROWS = Array.from({ length: 18 }, (_, i) => {
  const name = CUSTOMERS[i % CUSTOMERS.length];
  const contactSuffix = String(1000 + i * 37).slice(-4);
  return {
    id: `CUS-${String(i + 1).padStart(3, "0")}`,
    customerId: `CUS-${String(i + 1).padStart(3, "0")}`,
    customer: name,
    contact: `09${45 + (i % 9)}${" "}${567 + i} ${contactSuffix}`,
    email: i === 0 ? "juandelacruz@gmail.com" : "@gmail.com",
    totalBookings: 8 - Math.floor(i / 3),
    lastBooking: "January 10, 2067",
    customerType: CUSTOMER_TYPES[i % CUSTOMER_TYPES.length],
  };
});

export const CUSTOMER_REPORT_STATS = [
  { key: "totalCustomers", label: "Total Customers", value: "86" },
  { key: "newCustomers", label: "New Customers", value: "12" },
  { key: "repeatCustomers", label: "Repeat Customers", value: "74" },
];

export const CUSTOMER_BOOKING_STATUS = [
  { label: "Completed", value: 24, percent: "57.1%", color: "#6C8CF5" },
  { label: "Active", value: 18, percent: "42.9%", color: "#33C481" },
  { label: "Cancelled", value: 2, percent: "4.8%", color: "#F2A93B" },
];

export const CUSTOMER_BOOKING_TOTAL = 154;

// ---------------------------------------------------------------------------
// Payment Report
// ---------------------------------------------------------------------------

const PAYMENT_DESCRIPTIONS = ["50% Online Payment (Deposit)", "50% Front Desk Payment"];
const PAYMENT_METHODS = ["Online", "Front Desk"];
const PAYMENT_STATUSES = ["Paid", "Paid", "Paid", "Paid", "Paid", "Paid", "Pending", "Pending"];

export const PAYMENT_REPORT_ROWS = Array.from({ length: 22 }, (_, i) => {
  const vehicle = VEHICLES[i % VEHICLES.length];
  const isOnline = i % 2 === 0;
  return {
    id: `PMT-${1000 + i}`,
    date: buildDate(Math.floor(i / 2)),
    bookingId: `#BK-${1024 + Math.floor(i / 2)}`,
    customer: CUSTOMERS[Math.floor(i / 2) % CUSTOMERS.length],
    description: isOnline ? PAYMENT_DESCRIPTIONS[0] : PAYMENT_DESCRIPTIONS[1],
    method: isOnline ? PAYMENT_METHODS[0] : PAYMENT_METHODS[1],
    amount: 3500,
    status: PAYMENT_STATUSES[i % PAYMENT_STATUSES.length],
    reference: "OR-2026-0812-0001",
  };
});

export const PAYMENT_REPORT_STATS = [
  { key: "totalCollected", label: "Total Payments Collected", value: "₱148,600", change: "20.0%", direction: "up" },
  { key: "onlinePayments", label: "Online Payments", value: "₱74,300", change: "12.5%", direction: "up" },
  { key: "frontDeskPayments", label: "Front Desk Payments", value: "₱74,300", change: "8.2%", direction: "up" },
  { key: "pendingPayments", label: "Pending Payments", value: "₱12,450", change: "5.6%", direction: "down" },
];