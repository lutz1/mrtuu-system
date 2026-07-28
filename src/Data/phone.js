export function detectContactType(value) {
  const trimmed = value.trim();
  const isPhone = /^\+?[0-9\s-]{7,}$/.test(trimmed) && !trimmed.includes("@");
  return isPhone ? "phone" : "email";
}

export function normalizePhone(value) {
  const trimmed = value.trim().replace(/[\s-]/g, "");
  if (trimmed.startsWith("+")) return trimmed;                    // already E.164
  if (trimmed.startsWith("63")) return `+${trimmed}`;             // "63997..." -> "+63997..."
  if (trimmed.startsWith("0")) return `+63${trimmed.slice(1)}`;   // "0997..." -> "+63997..."
  return `+63${trimmed}`;                                          // bare "997..." -> "+63997..."
}