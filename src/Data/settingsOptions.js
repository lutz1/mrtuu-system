// Static option lists for Settings dropdowns — swap with real data
// (e.g. supported locales/currencies from a config or backend) later.

export const LANGUAGE_OPTIONS = [
  { value: "en-US", label: "English (US)" },
  { value: "en-PH", label: "English (Philippines)" },
  { value: "fil", label: "Filipino" },
  { value: "ceb", label: "Cebuano" },
];

export const CURRENCY_OPTIONS = [
  { value: "PHP", label: "PHP - Philippine Peso (₱)" },
  { value: "USD", label: "USD - US Dollar ($)" },
];

export const PICKUP_LOCATION_OPTIONS = [
  { value: "apokon_tagum", label: "Apokon, Tagum City" },
  { value: "davao_city", label: "Davao City, Davao del Sur" },
  { value: "buhangin_davao", label: "Buhangin, Davao City" },
];

export const DEFAULT_SETTINGS = {
  language: "en-US",
  currency: "PHP",
  theme: "light",
  pickupLocation: "apokon_tagum",
  alwaysUseCurrentLocation: false,
};