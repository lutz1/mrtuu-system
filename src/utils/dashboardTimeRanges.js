// Shared time-range bucketing for admin dashboard charts.
// Each range defines: the window start, the bucket labels, and how to
// map a given Date to a bucket index within that window.

export const RANGE_OPTIONS = ["Today", "This Week", "This Month", "This Year"];

function startOfDay(d) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function getRangeConfig(range) {
  const now = new Date();

  switch (range) {
    case "Today": {
      const start = startOfDay(now);
      const labels = ["12AM", "4AM", "8AM", "12PM", "4PM", "8PM"];
      return {
        start,
        labels,
        getBucketIndex: (d) => Math.floor(d.getHours() / 4),
      };
    }

    case "This Month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      const weekCount = Math.ceil(daysInMonth / 7);
      const labels = Array.from(
        { length: weekCount },
        (_, i) => `Week ${i + 1}`
      );
      return {
        start,
        labels,
        getBucketIndex: (d) => Math.min(Math.floor((d.getDate() - 1) / 7), weekCount - 1),
      };
    }

    case "This Year": {
      const start = new Date(now.getFullYear(), 0, 1);
      const labels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      return {
        start,
        labels,
        getBucketIndex: (d) => d.getMonth(),
      };
    }

    case "This Week":
    default: {
      const day = now.getDay();
      const start = startOfDay(now);
      start.setDate(now.getDate() - day);
      const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return {
        start,
        labels,
        getBucketIndex: (d) => d.getDay(),
      };
    }
  }
}

// Buckets `items` into totals per the range config.
// `getDate(item)` returns the JS Date for that item (already resolved from Firestore Timestamp).
// `getValue(item)` returns the numeric value to sum (return 1 for a plain count).
export function bucketByRange(items, range, getDate, getValue = () => 1) {
  const config = getRangeConfig(range);
  const totals = new Array(config.labels.length).fill(0);

  items.forEach((item) => {
    const d = getDate(item);
    if (!d || d < config.start) return;
    const idx = config.getBucketIndex(d);
    if (idx >= 0 && idx < totals.length) {
      totals[idx] += getValue(item);
    }
  });

  return config.labels.map((label, i) => ({ label, value: totals[i] }));
}