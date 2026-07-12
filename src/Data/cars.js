// Shared car catalog — swap with real data / API calls once the backend exists.
// Both ShowroomPage and VehicleOverviewPage import from here so there's one
// source of truth instead of duplicated arrays that can drift out of sync.

const MODEL_DETAILS = {
  "Toyota Fortuner": {
    description:
      "The Toyota Fortuner is a rugged, 7-seater mid-size SUV built on a durable Hilux pickup platform. Combining a muscular exterior design with practical, family-friendly interiors, it is celebrated worldwide for its supreme reliability and exceptional off-road capabilities.",
    features: [
      "Automatic Transmission",
      "7 Seats",
      "Air Conditioning",
      "Bluetooth",
      "Power Steering",
      "Airbags",
      "USB Charging",
      "Cruise Control",
    ],
    images: [
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
    ],
  },
  "Suzuki Swift": {
    description:
      "The Suzuki Swift is a nimble, fuel-efficient hatchback built for city driving. Its compact footprint makes parking and maneuvering effortless, while the punchy engine and light chassis keep it fun to drive on longer trips too.",
    features: [
      "Manual Transmission",
      "5 Seats",
      "Air Conditioning",
      "Bluetooth",
      "Power Steering",
      "Airbags",
      "USB Charging",
      "Keyless Entry",
    ],
    images: [
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
    ],
  },
  "Toyota Corolla": {
    description:
      "The Toyota Corolla is a dependable compact sedan known for its smooth ride, spacious cabin, and legendary reliability. It's a comfortable, no-fuss choice for both daily commutes and long-distance road trips.",
    features: [
      "Automatic Transmission",
      "5 Seats",
      "Air Conditioning",
      "Bluetooth",
      "Power Steering",
      "Airbags",
      "USB Charging",
      "Rear Camera",
    ],
    images: [
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
      "https://imgs.search.brave.com/x2nbx6yY2K9GnlaSglPjSaQnn_7IHDJrZ3O8NfQEDBE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VwZXItc3Bv/cnRzLWNhci13aGl0/ZS1iYWNrZ3JvdW5k/LTNkLWlsbHVzdHJh/dGlvbl8xMDEyNjYt/MTAzNzEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw",
    ],
  },
};

export const RENTAL_POLICIES = [
  {
    title: "Driver Requirements",
    content:
      "Renters must be at least 21 years old and hold a valid driver's license for a minimum of 2 years. A valid government-issued ID and proof of billing are also required at pickup.",
  },
  {
    title: "Rental Rules",
    content:
      "The vehicle must not be used for racing, off-roading outside designated areas, or subletting to a third party. Smoking inside the vehicle is strictly prohibited.",
  },
  {
    title: "Fuel Policy",
    content:
      "Vehicles are provided with a full tank and must be returned with a full tank. A refueling fee will apply if the vehicle is returned with less fuel than at pickup.",
  },
  {
    title: "Cleanliness",
    content:
      "Vehicles should be returned in the same clean condition as received. A cleaning fee applies for excessive dirt, stains, or odors beyond normal use.",
  },
  {
    title: "Damage and Insurance",
    content:
      "All rentals include basic insurance coverage. Renters are liable for damages not covered by insurance, including tire, windshield, and interior damage. A security deposit is held during the rental period.",
  },
  {
    title: "Cancellation Policy",
    content:
      "Free cancellation up to 48 hours before pickup. Cancellations within 48 hours are subject to a 20% fee. No-shows are charged the full rental amount.",
  },
];

export const CARS = [
  {
    id: 1,
    name: "Toyota Fortuner",
    price: 2700,
    transmission: "Automatic",
    fuelType: "Diesel",
    carType: "SUV",
    brand: "Toyota",
    seats: 7,
    mileage: "Unlimited",
    ...MODEL_DETAILS["Toyota Fortuner"],
  },
  {
    id: 2,
    name: "Suzuki Swift",
    price: 2700,
    transmission: "Automatic",
    fuelType: "Diesel",
    carType: "Hatchback",
    brand: "Suzuki",
    seats: 5,
    mileage: "Unlimited",
    ...MODEL_DETAILS["Suzuki Swift"],
  },
  {
    id: 3,
    name: "Toyota Corolla",
    price: 2700,
    transmission: "Automatic",
    fuelType: "Petrol",
    carType: "Sedan",
    brand: "Toyota",
    seats: 5,
    mileage: "Unlimited",
    ...MODEL_DETAILS["Toyota Corolla"],
  },
  {
    id: 4,
    name: "Suzuki Swift",
    price: 2700,
    transmission: "Automatic",
    fuelType: "Diesel",
    carType: "Hatchback",
    brand: "Suzuki",
    seats: 5,
    mileage: "Unlimited",
    ...MODEL_DETAILS["Suzuki Swift"],
  },
  {
    id: 5,
    name: "Toyota Fortuner",
    price: 2700,
    transmission: "Automatic",
    fuelType: "Diesel",
    carType: "SUV",
    brand: "Toyota",
    seats: 7,
    mileage: "Unlimited",
    ...MODEL_DETAILS["Toyota Fortuner"],
  },
  {
    id: 6,
    name: "Toyota Corolla",
    price: 2700,
    transmission: "Automatic",
    fuelType: "Petrol",
    carType: "Sedan",
    brand: "Toyota",
    seats: 5,
    mileage: "Unlimited",
    ...MODEL_DETAILS["Toyota Corolla"],
  },
  {
    id: 7,
    name: "Toyota Corolla",
    price: 2700,
    transmission: "Automatic",
    fuelType: "Petrol",
    carType: "Sedan",
    brand: "Toyota",
    seats: 5,
    mileage: "Unlimited",
    ...MODEL_DETAILS["Toyota Corolla"],
  },
  {
    id: 8,
    name: "Suzuki Swift",
    price: 2700,
    transmission: "Automatic",
    fuelType: "Diesel",
    carType: "Hatchback",
    brand: "Suzuki",
    seats: 5,
    mileage: "Unlimited",
    ...MODEL_DETAILS["Suzuki Swift"],
  },
];