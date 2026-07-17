// Mock payment data — swap with real Firestore/Stripe/PayMongo data later.

export const CARDS = [
  {
    id: "card_001",
    label: "Premium Mastercard",
    type: "mastercard",
    last4: "4242",
    expiry: "12/67",
    isDefault: true,
  },
  {
    id: "card_002",
    label: "Visa Infinite",
    type: "visa",
    last4: "6767",
    expiry: "08/67",
    isDefault: false,
  },
];

export const DIGITAL_WALLETS = [
  {
    id: "wallet_gcash",
    provider: "GCash",
    connected: true,
    accountNumber: "0967***1234",
  },
  {
    id: "wallet_maya",
    provider: "Maya",
    connected: false,
    accountNumber: null,
  },
];

export const BILLING_STATUS = {
  SUCCESSFUL: "successful",
  FAILED: "failed",
  PENDING: "pending",
};

export const RECENT_BILLING = [
  {
    id: "bill_001",
    date: "2067-07-13",
    description: "Toyota Fortuner Rental - 3 Days",
    method: "Visa **** 4242",
    amount: 8750,
    status: BILLING_STATUS.SUCCESSFUL,
  },
  {
    id: "bill_002",
    date: "2067-05-02",
    description: "Honda Civic - 3 Days",
    method: "GCash",
    amount: 9468,
    status: BILLING_STATUS.SUCCESSFUL,
  },
];