// Mock booking data — swap with real Firestore/API data once the backend
// exists. Each booking references a carId from cars.js so vehicle specs
// (transmission, fuel type, seats) stay in one place instead of being
// duplicated here.

export const BOOKING_STATUS = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const BOOKINGS = [
  {
    id: "bk_001",
    carId: 1, // Toyota Fortuner
    status: BOOKING_STATUS.ONGOING,
    price: 8750,
    startDate: "2067-07-14",
    endDate: "2067-07-17",
    location: "Apokon, Tagum City",
    plateNumber: "FORTNR",
  },
  {
    id: "bk_002",
    carId: 3, // Toyota Corolla — placeholder until Honda Civic exists in cars.js
    status: BOOKING_STATUS.COMPLETED,
    price: 9468,
    startDate: "2067-05-03",
    endDate: "2067-05-05",
    location: "Davao City, Davao del Sur",
  },
  {
    id: "bk_003",
    carId: 2, // Suzuki Swift
    status: BOOKING_STATUS.CANCELLED,
    price: 0,
    startDate: "2067-02-14",
    endDate: "2067-02-15",
    location: null,
    refundedOn: "2067-02-12",
  },
];