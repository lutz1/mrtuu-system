import {
  faCarSide,
  faCreditCard,
  faBookBookmark,
} from "@fortawesome/free-solid-svg-icons";

export const WHY_US = [
  {
    id: 1,
    icon: faCarSide,
    title: "Variety of Cars",
    description: "Find the perfect vehicle for any trip.",
  },
  {
    id: 2,
    icon: faCreditCard,
    title: "Best Value",
    description: "Transparent pricing with no hidden charges.",
  },
  {
    id: 3,
    icon: faBookBookmark,
    title: "Quick Booking",
    description: "Book your car in minutes, anytime, anywhere.",
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose Your Car",
    description:
      "Browse our available vehicles and select the one that fits your needs.",
  },
  {
    step: 2,
    title: "Select Your Dates",
    description: "Choose your pickup and return schedule.",
  },
  {
    step: 3,
    title: "Confirm Your Booking",
    description: "Complete your reservation and get ready to drive.",
  },
];

export const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "How It Works", to: "/requirements" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Bookings", to: "/account/bookings" },
      { label: "Account Settings", to: "/account/settings" },
      { label: "Login", to: "/login" },
      { label: "Sign Up", to: "/signup" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Showroom", to: "/showroom" },
    ],
  },
];
