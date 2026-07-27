// TODO: mock data — replace with real customer records once the admin
// data layer exists.
//
// NOTE: the reference design left every row after the first with a bare
// "@gmail.com" email, an identical driver's license number across all
// rows, and an identical (and implausible, year 2067) joined date. Those
// read as unfilled placeholders rather than intentional values, so this
// data varies them per row instead of replicating the placeholder.

export const CUSTOMER_STATUSES = ["Verified", "Unverified"];

const FIRST_NAMES = [
  "Juan", "Ram", "Tortskie", "Leigh", "Maria", "Vincent", "Hanni",
  "Carlo", "Bea", "Nico", "Angela", "Paolo", "Kristine", "Miguel",
  "Diana", "Renz", "Cathy", "Jomar", "Ella", "Sean", "Trisha", "Kevin",
];

const LAST_NAMES = [
  "Dela Cruz", "Boy", "Jerwen", "Carcallas", "Santos", "Fabron", "Pham",
  "Reyes", "Fernandez", "Villanueva", "Cruz", "Ramos", "Uy", "Santos",
  "Torres", "Aquino", "Lim", "Reyes", "Navarro", "Bautista", "Gomez", "Ong",
];

function pad(n, width) {
  return String(n).padStart(width, "0");
}

function makeLicense(i) {
  return `N${(i % 9) + 1}-${pad((i % 12) + 1, 2)}-${pad(100000 + i * 37, 6)}`;
}

function makeJoinedDate(i) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = months[i % 12];
  const day = (i % 28) + 1;
  const year = 2024 + (i % 2);
  return `${month} ${day}, ${year}`;
}

export const MOCK_CUSTOMERS = Array.from({ length: 124 }, (_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[i % LAST_NAMES.length];
  const fullName = i === 0 ? "Juan Dela Cruz" : i === 1 ? "Ram Boy" : `${first} ${last}`;
  const emailHandle = fullName.toLowerCase().replace(/[^a-z]/g, "");

  return {
    id: `CUS-${pad(i + 1, 3)}`,
    name: fullName,
    phone: `09${pad(10 + (i % 90), 2)} ${pad(100 + i * 3, 3)} ${pad(1000 + i * 11, 4)}`,
    email: `${emailHandle}${i > 1 ? i : ""}@gmail.com`,
    license: makeLicense(i),
    joinedDate: makeJoinedDate(i),
    status: i % 7 === 3 || i % 11 === 0 ? "Unverified" : "Verified",
  };
});